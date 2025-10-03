# AudioAnalyser Utility

This module provides a simple `AudioAnalyser` class for monitoring and reporting the current audio level within the application. It leverages the Web Audio API's `AnalyserNode` to capture frequency data, from which an average audio level is calculated. This level can then be used by other components, such as UI elements, to visually represent the current audio intensity.

## Usage

1.  **Initialization:**
    The `AudioAnalyser` is initialized with an `AudioContext`.
    ```typescript
    import { AudioAnalyser } from './utils/AudioAnalyser';
    // Assuming you have an AudioContext instance
    const audioAnalyser = new AudioAnalyser(audioContext);
    ```

2.  **Starting Analysis:**
    To begin capturing and dispatching audio level changes, call the `start()` method.
    ```typescript
    audioAnalyser.start();
    ```

3.  **Stopping Analysis:**
    To stop the analysis and prevent further updates, call the `stop()` method.
    ```typescript
    audioAnalyser.stop();
    ```

4.  **Listening for Audio Level Changes:**
    The `AudioAnalyser` dispatches a custom event `audio-level-changed` whenever the audio level is updated. This event's `detail` property contains the current audio level as a normalized number between 0 and 1.
    ```typescript
    audioAnalyser.addEventListener('audio-level-changed', (e) => {
      const customEvent = e as CustomEvent<number>;
      const level = customEvent.detail;
      console.log('Current audio level:', level);
      // Update UI or perform other actions based on the level
    });
    ```

## Class: `AudioAnalyser`

### Constructor

*   `constructor(context: AudioContext)`
    *   Initializes the `AudioAnalyser` with an `AudioContext`.
    *   Creates an `AnalyserNode` and sets its `smoothingTimeConstant` to `0` for immediate feedback.
    *   Prepares a `Uint8Array` to store frequency data.

### Properties

*   `readonly node: AnalyserNode`
    *   The Web Audio API `AnalyserNode` used for analysis.
*   `private readonly freqData: Uint8Array`
    *   An array to hold the frequency data obtained from the `AnalyserNode`.
*   `private rafId: number | null = null`
    *   Stores the ID of the animation frame request, used for controlling the animation loop.

### Methods

*   `getCurrentLevel(): number`
    *   Retrieves the current frequency data from the `AnalyserNode`.
    *   Calculates the average of the frequency data.
    *   Normalizes the average level to a value between 0 and 1 by dividing by `0xff`.
    *   Returns the normalized average audio level.

*   `loop()`
    *   This method is the core of the animation loop.
    *   It requests the next animation frame using `requestAnimationFrame` to call itself again, creating a continuous loop.
    *   It calls `getCurrentLevel()` to get the current audio level.
    *   It dispatches a custom event `audio-level-changed` with the calculated level as the `detail`.

*   `start = this.loop`
    *   An alias for the `loop` method, providing a clearer public interface for starting the analysis.

*   `stop()`
    *   Cancels the animation frame request using `cancelAnimationFrame` if `rafId` is set, effectively stopping the `loop`.

## Event: `audio-level-changed`

*   **Detail:** `number` (Normalized audio level between 0 and 1).
*   **Description:** Dispatched whenever the audio level is updated by the `loop` method.

## Internal Structure

The `AudioAnalyser` class extends `EventTarget` to enable dispatching custom events. The `loop` method is designed to be called repeatedly via `requestAnimationFrame`, ensuring smooth updates. The `node` property is the direct interface to the Web Audio API's `AnalyserNode`, allowing for detailed frequency analysis if needed, though this class focuses on the average level.
`
