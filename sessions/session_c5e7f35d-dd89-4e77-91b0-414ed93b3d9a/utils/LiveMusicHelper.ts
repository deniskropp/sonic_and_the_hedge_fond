/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import type { PlaybackState, Prompt } from '../types';
import type { AudioChunk, GoogleGenAI, LiveMusicFilteredPrompt, LiveMusicServerMessage, LiveMusicSession } from '@google/genai';
import { decode, decodeAudioData } from './audio';
import { throttle } from './throttle';

/**
 * ## `utils/LiveMusicHelper.ts`
 *
 * This utility class acts as the primary bridge between the frontend components and the `@google/genai` library for real-time music generation. It manages the connection to the AI model, processes incoming audio data, handles prompt weighting, and controls the playback state.
 *
 * ### Purpose
 *
 * - Facilitate real-time music generation by interacting with the Google Generative AI API.
 * - Process and manage audio chunks received from the AI model.
 * - Control the playback state (playing, paused, stopped, loading).
 * - Handle prompt filtering and dispatch notifications for filtered prompts.
 * - Allow for external audio processing nodes (e.g., audio level analysis) to be connected.
 *
 * ### Key Properties
 *
 * *   `ai`: An instance of `GoogleGenAI` used to interact with the API.
 * *   `model`: The identifier for the AI music generation model.
 * *   `session`: The current `LiveMusicSession` object, representing the active connection to the AI service. It is initialized lazily.
 * *   `sessionPromise`: A promise that resolves to the `LiveMusicSession`, used for managing concurrent connection attempts.
 * *   `connectionError`: A boolean flag indicating if a connection error has occurred.
 * *   `filteredPrompts`: A `Set` storing the text of prompts that have been filtered by the AI.
 * *   `nextStartTime`: The scheduled start time for the next audio chunk in the `AudioContext`.
 * *   `bufferTime`: A buffer period (in seconds) to ensure smooth playback initiation.
 * *   `audioContext`: The Web Audio API `AudioContext` used for audio processing and playback.
 * *   `extraDestination`: An optional `AudioNode` where audio can be routed for additional processing (e.g., `AudioAnalyser`).
 * *   `outputNode`: A `GainNode` used to control the volume of the audio output.
 * *   `playbackState`: The current state of the music playback (`stopped`, `playing`, `loading`, `paused`).
 * *   `prompts`: A `Map` storing the current state of all prompts, including their text, weight, CC mapping, and color.
 *
 * ### Core Methods
 *
 * *   `getSession()`: Returns the `LiveMusicSession`, establishing a connection if one does not already exist.
 * *   `connect()`: Establishes a connection to the AI music generation service. It sets up callbacks for message handling (`onmessage`), errors (`onerror`), and connection closure (`onclose`).
 * *   `setPlaybackState(state: PlaybackState)`: Updates the internal `playbackState` and dispatches a `playback-state-changed` event.
 * *   `processAudioChunks(audioChunks: AudioChunk[])`: Decodes and schedules the playback of received audio data chunks using the `AudioContext`. It manages `nextStartTime` to ensure smooth, sequential playback and handles state transitions based on buffer timing.
 * *   `activePrompts` (getter): Returns an array of prompts that are currently active (not filtered and have a weight greater than 0).
 * *   `setWeightedPrompts(prompts: Map<string, Prompt>)`: Updates the AI model with the current set of weighted prompts. This method is throttled to prevent excessive API calls. It filters out inactive prompts before sending the update.
 * *   `play()`: Initiates the music playback. It ensures a session is established, updates prompts, resumes the `AudioContext`, and starts the audio output.
 * *   `pause()`: Pauses the music playback. It stops the AI session, sets the state to `paused`, and fades out the audio output.
 * *   `stop()`: Stops the music playback entirely. It closes the AI session, resets playback state and timing, and fades out the audio output.
 * *   `playPause()`: Toggles the playback state between playing, paused, and stopped based on the current `playbackState`.
 *
 * ### Event Dispatches
 *
 * *   `playback-state-changed`: Dispatched whenever the `playbackState` property changes, providing the new state.
 * *   `filtered-prompt`: Dispatched when the AI model filters out a prompt. Includes details about the filtered prompt and the reason for filtering.
 * *   `error`: Dispatched when a connection error or other critical issue occurs.
 *
 */
export class LiveMusicHelper extends EventTarget {

  private ai: GoogleGenAI;
  private model: string;

  private session: LiveMusicSession | null = null;
  private sessionPromise: Promise<LiveMusicSession> | null = null;

  private connectionError = true;

  private filteredPrompts = new Set<string>();
  private nextStartTime = 0;
  private bufferTime = 2;

  public readonly audioContext: AudioContext;
  public extraDestination: AudioNode | null = null;

  private outputNode: GainNode;
  private playbackState: PlaybackState = 'stopped';

  private prompts: Map<string, Prompt>;

  constructor(ai: GoogleGenAI, model: string) {
    super();
    this.ai = ai;
    this.model = model;
    this.prompts = new Map();
    this.audioContext = new AudioContext({ sampleRate: 48000 });
    this.outputNode = this.audioContext.createGain();
  }

  private getSession(): Promise<LiveMusicSession> {
    if (!this.sessionPromise) this.sessionPromise = this.connect();
    return this.sessionPromise;
  }

  private async connect(): Promise<LiveMusicSession> {
    this.sessionPromise = this.ai.live.music.connect({
      model: this.model,
      callbacks: {
        onmessage: async (e: LiveMusicServerMessage) => {
          if (e.setupComplete) {
            this.connectionError = false;
          }
          if (e.filteredPrompt) {
            // Store the filtered prompt text for client-side filtering.
            this.filteredPrompts = new Set([...this.filteredPrompts, e.filteredPrompt.text!])
            // Dispatch an event to notify the UI about the filtered prompt and its reason.
            this.dispatchEvent(new CustomEvent<LiveMusicFilteredPrompt>('filtered-prompt', { detail: e.filteredPrompt }));
          }
          if (e.serverContent?.audioChunks) {
            await this.processAudioChunks(e.serverContent.audioChunks);
          }
        },
        onerror: () => {
          this.connectionError = true;
          this.stop();
          this.dispatchEvent(new CustomEvent('error', { detail: 'Connection error, please restart audio.' }));
        },
        onclose: () => {
          this.connectionError = true;
          this.stop();
          this.dispatchEvent(new CustomEvent('error', { detail: 'Connection error, please restart audio.' }));
        },
      },
    });
    return this.sessionPromise;
  }

  private setPlaybackState(state: PlaybackState) {
    this.playbackState = state;
    this.dispatchEvent(new CustomEvent('playback-state-changed', { detail: state }));
  }

  private async processAudioChunks(audioChunks: AudioChunk[]) {
    // Do not process audio if paused or stopped.
    if (this.playbackState === 'paused' || this.playbackState === 'stopped') return;
    
    // Decode the audio data from the received chunks.
    const audioBuffer = await decodeAudioData(
      decode(audioChunks[0].data!),
      this.audioContext,
      48000,
      2,
    );
    
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.outputNode);

    // If this is the first chunk after a pause/stop, schedule it after a buffer time.
    if (this.nextStartTime === 0) {
      this.nextStartTime = this.audioContext.currentTime + this.bufferTime;
      // Set playback to 'playing' after the buffer time has elapsed.
      setTimeout(() => {
        this.setPlaybackState('playing');
      }, this.bufferTime * 1000);
    }
    
    // If the next start time is already in the past, it indicates a delay or issue, reset and flag as loading.
    if (this.nextStartTime < this.audioContext.currentTime) {
      this.setPlaybackState('loading');
      this.nextStartTime = 0;
      return;
    }
    
    // Schedule the audio chunk to play at the calculated start time.
    source.start(this.nextStartTime);
    // Update the next start time based on the duration of the current chunk.
    this.nextStartTime += audioBuffer.duration;
  }

  /** 
   * Returns prompts that are not filtered and have a weight greater than 0. 
   * These are the prompts that will be sent to the AI model.
   */
  public get activePrompts() {
    return Array.from(this.prompts.values())
      .filter((p) => {
        // Filter out prompts that are client-side filtered or have zero weight.
        return !this.filteredPrompts.has(p.text) && p.weight !== 0;
      })
  }

  /**
   * Updates the AI model with the current set of weighted prompts. 
   * This method is throttled to prevent overwhelming the AI API with rapid updates.
   * It filters out inactive prompts before sending the update.
   */
  public readonly setWeightedPrompts = throttle(async (prompts: Map<string, Prompt>) => {
    this.prompts = prompts;

    // Ensure there is at least one active prompt; otherwise, stop playback and notify the user.
    if (this.activePrompts.length === 0) {
      this.dispatchEvent(new CustomEvent('error', { detail: 'There needs to be one active prompt to play.' }));
      this.pause();
      return;
    }

    // If the session is not yet established, store the prompts to be set later.
    // A user interaction is required before `setWeightedPrompts` can be called successfully.
    if (!this.session) return;

    try {
      // Send the active prompts to the AI model.
      await this.session.setWeightedPrompts({
        weightedPrompts: this.activePrompts,
      });
    } catch (e: any) {
      // Dispatch an error event if setting prompts fails.
      this.dispatchEvent(new CustomEvent('error', { detail: e.message }));
      this.pause();
    }
  }, 200); // Throttle delay of 200ms

  /**
   * Initiates music playback.
   * Ensures a session is established, updates prompts, resumes the AudioContext, and starts the audio output.
   */
  public async play() {
    this.setPlaybackState('loading');
    this.session = await this.getSession();
    await this.setWeightedPrompts(this.prompts);
    this.audioContext.resume();
    this.session.play();
    this.outputNode.connect(this.audioContext.destination);
    if (this.extraDestination) this.outputNode.connect(this.extraDestination);
    // Fade in the audio output.
    this.outputNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.outputNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.1);
  }

  /**
   * Pauses music playback.
   * Stops the AI session, sets the state to `paused`, and fades out the audio output.
   */
  public pause() {
    if (this.session) this.session.pause();
    this.setPlaybackState('paused');
    // Fade out the audio output.
    this.outputNode.gain.setValueAtTime(1, this.audioContext.currentTime);
    this.outputNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
    this.nextStartTime = 0; // Reset start time for smooth resume.
    // Recreate the output node to ensure a clean state after pausing.
    this.outputNode = this.audioContext.createGain();
  }

  /**
   * Stops music playback entirely.
   * Closes the AI session, resets playback state and timing, and fades out the audio output.
   */
  public stop() {
    if (this.session) this.session.stop();
    this.setPlaybackState('stopped');
    // Fade out the audio output.
    this.outputNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.outputNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.1);
    this.nextStartTime = 0;
    // Clear the session and promise to allow for reconnection.
    this.session = null;
    this.sessionPromise = null;
  }

  /**
   * Toggles the playback state between playing, paused, and stopped.
   * If the current state is 'loading', it stops playback.
   */
  public async playPause() {
    switch (this.playbackState) {
      case 'playing':
        return this.pause();
      case 'paused':
      case 'stopped':
        return this.play();
      case 'loading':
        return this.stop();
    }
  }

}
