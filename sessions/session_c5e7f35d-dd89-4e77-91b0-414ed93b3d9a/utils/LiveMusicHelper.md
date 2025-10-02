## `utils/LiveMusicHelper.ts`

This utility class acts as the primary bridge between the frontend components and the `@google/genai` library for real-time music generation. It manages the connection to the AI model, processes incoming audio data, handles prompt weighting, and controls the playback state.

### Purpose

- Facilitate real-time music generation by interacting with the Google Generative AI API.
- Process and manage audio chunks received from the AI model.
- Control the playback state (playing, paused, stopped, loading).
- Handle prompt filtering and dispatch notifications for filtered prompts.
- Allow for external audio processing nodes (e.g., audio level analysis) to be connected.

### Key Properties

*   `ai`: An instance of `GoogleGenAI` used to interact with the API.
*   `model`: The identifier for the AI music generation model.
*   `session`: The current `LiveMusicSession` object, representing the active connection to the AI service. It is initialized lazily.
*   `sessionPromise`: A promise that resolves to the `LiveMusicSession`, used for managing concurrent connection attempts.
*   `connectionError`: A boolean flag indicating if a connection error has occurred.
*   `filteredPrompts`: A `Set` storing the text of prompts that have been filtered by the AI.
*   `nextStartTime`: The scheduled start time for the next audio chunk in the `AudioContext`.
*   `bufferTime`: A buffer period (in seconds) to ensure smooth playback initiation.
*   `audioContext`: The Web Audio API `AudioContext` used for audio processing and playback.
*   `extraDestination`: An optional `AudioNode` where audio can be routed for additional processing (e.g., `AudioAnalyser`).
*   `outputNode`: A `GainNode` used to control the volume of the audio output.
*   `playbackState`: The current state of the music playback (`stopped`, `playing`, `loading`, `paused`).
*   `prompts`: A `Map` storing the current state of all prompts, including their text, weight, CC mapping, and color.

### Core Methods

*   `getSession()`: Returns the `LiveMusicSession`, establishing a connection if one does not already exist.
*   `connect()`: Establishes a connection to the AI music generation service. It sets up callbacks for message handling (`onmessage`), errors (`onerror`), and connection closure (`onclose`).
*   `setPlaybackState(state: PlaybackState)`: Updates the internal `playbackState` and dispatches a `playback-state-changed` event.
*   `processAudioChunks(audioChunks: AudioChunk[])`: Decodes and schedules the playback of received audio data chunks using the `AudioContext`. It manages `nextStartTime` to ensure smooth, sequential playback and handles state transitions based on buffer timing.
*   `activePrompts` (getter): Returns an array of prompts that are currently active (not filtered and have a weight greater than 0).
*   `setWeightedPrompts(prompts: Map<string, Prompt>)`: Updates the AI model with the current set of weighted prompts. This method is throttled to prevent excessive API calls. It filters out inactive prompts before sending the update.
*   `play()`: Initiates the music playback. It ensures a session is established, updates prompts, resumes the `AudioContext`, and starts the audio output.
*   `pause()`: Pauses the music playback. It stops the AI session, sets the state to `paused`, and fades out the audio output.
*   `stop()`: Stops the music playback entirely. It closes the AI session, resets playback state and timing, and fades out the audio output.
*   `playPause()`: Toggles the playback state between playing, paused, and stopped based on the current `playbackState`.

### Event Dispatches

*   `playback-state-changed`: Dispatched whenever the `playbackState` property changes, providing the new state.
*   `filtered-prompt`: Dispatched when the AI model filters out a prompt. Includes details about the filtered prompt and the reason for filtering.
*   `error`: Dispatched when a connection error or other critical issue occurs.
