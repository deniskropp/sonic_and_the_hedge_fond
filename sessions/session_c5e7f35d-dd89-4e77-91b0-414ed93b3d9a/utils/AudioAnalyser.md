## `utils/AudioAnalyser.ts`

This module provides the `AudioAnalyser` class, a utility designed to monitor and report the real-time audio levels within the application. It leverages the Web Audio API's `AnalyserNode` to capture frequency data and then computes an average level, which is dispatched as an event.

### `AudioAnalyser` Class

This class extends `EventTarget` to allow other parts of the application to subscribe to audio level changes.

#### Constructor

-   **`constructor(context: AudioContext)`**:
    -   Initializes the `AudioAnalyser` by creating an `AnalyserNode` from the provided `AudioContext`.
    -   Configures the `AnalyserNode` with `smoothingTimeConstant = 0` for immediate feedback.
    -   Initializes a `Uint8Array` (`freqData`) to store frequency bin magnitudes.
    -   Binds the `loop` method to ensure correct `this` context.

#### Methods

-   **`getCurrentLevel(): number`**:
    -   Retrieves the current audio frequency data from the `AnalyserNode` into the `freqData` array.
    -   Calculates the average magnitude across all frequency bins.
    -   Normalizes the average value to a range between 0 and 1 (by dividing by `0xff`, the maximum possible value for a frequency bin).
    -   Returns the normalized average audio level.

-   **`loop(): void`**:
    -   This method is intended to be called repeatedly, typically via `requestAnimationFrame`.
    -   It calls `getCurrentLevel()` to get the audio level.
    -   Dispatches a custom event named `audio-level-changed` with the calculated level as `detail`.
    -   Schedules itself to run again using `requestAnimationFrame`.

-   **`start(): void`**:
    -   Alias for the `loop` method. Call this to begin the audio level monitoring loop.

-   **`stop(): void`**:
    -   Cancels the animation frame request, effectively stopping the `loop` and subsequent event dispatches.

#### Events

-   **`audio-level-changed`**:
    -   Dispatched whenever `loop()` is executed.
    -   `detail`: A `number` representing the normalized current audio level (0 to 1).

#### Integration with `LiveMusicHelper`

The `AudioAnalyser` can serve as an `extraDestination` for the `LiveMusicHelper`. By connecting the `outputNode` of `LiveMusicHelper` to the `node` of `AudioAnalyser`, the `AudioAnalyser` can process the audio output from the AI model, allowing the application to visualize the AI-generated music's volume levels.

```typescript
// Example Usage:

import { AudioAnalyser } from './utils/AudioAnalyser';

// Assume 'liveMusicHelper' is an instance of LiveMusicHelper
// and 'pdjMidi' is an instance of PromptDjMidi

const audioAnalyser = new AudioAnalyser(liveMusicHelper.audioContext);
// Connect the output of LiveMusicHelper to the AnalyserNode
liveMusicHelper.extraDestination = audioAnalyser.node;

// Listen for audio level changes
audioAnalyser.addEventListener('audio-level-changed', (e) => {
  const level = (e as CustomEvent<number>).detail;
  pdjMidi.audioLevel = level; // Update UI component
});

// To start monitoring:
// audioAnalyser.start();

// To stop monitoring:
// audioAnalyser.stop();
```