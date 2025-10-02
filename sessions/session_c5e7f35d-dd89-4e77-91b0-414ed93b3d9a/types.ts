/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Defines the core data structures and interfaces used throughout the PromptDJ MIDI myfirstanalog project.
 * These types ensure type safety and provide a clear understanding of the data being passed between different parts of the application, such as prompt configurations, MIDI inputs, and playback status.
 */

/**
 * Represents a single controllable prompt within the application.
 * @property {string} promptId - A unique identifier for the prompt.
 * @property {string} text - The actual text content of the prompt.
 * @property {number} weight - The current weight or intensity of the prompt, typically ranging from 0 to 2. This value influences the AI's generation and the prompt's prominence in the mix.
 * @property {number} cc - The MIDI Continuous Controller (CC) number mapped to this prompt's weight. This mapping is crucial for controlling prompts via external MIDI hardware.
 * @property {string} color - A representative color for the prompt, used for visual feedback.
 */
export interface Prompt {
  readonly promptId: string;
  text: string;
  weight: number;
  cc: number;
  color: string;
}

/**
 * Represents a MIDI Control Change (CC) message.
 * @property {number} channel - The MIDI channel the message was received on.
 * @property {number} cc - The MIDI CC number (0-127).
 * @property {number} value - The value of the CC message (0-127).
 */
export interface ControlChange {
  channel: number;
  cc: number;
  value: number;
}

/**
 * Defines the possible states of the music playback.
 * @property {'stopped'} stopped - The music is not currently playing.
 * @property {'playing'} playing - The music is actively playing.
 * @property {'loading'} loading - The system is currently generating or buffering audio. This state typically precedes 'playing'.
 * @property {'paused'} paused - The music playback has been temporarily halted but can be resumed.
 */
export type PlaybackState = 'stopped' | 'playing' | 'loading' | 'paused';
