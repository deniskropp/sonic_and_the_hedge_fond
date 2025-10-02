## `utils/audio.ts`

This file contains utility functions for handling audio data, specifically for encoding, decoding, and creating `Blob` objects compatible with the `@google/genai` library. It facilitates the conversion of audio data between different formats required for AI model interaction and web compatibility.

### Functions:

*   **`encode(bytes: Uint8Array): string`**
    *   **Purpose:** Converts a `Uint8Array` into a base64 encoded string.
    *   **Usage:** This is used internally to prepare binary audio data for transmission or storage where a string format is required.
    *   **Mechanism:** Iterates through the byte array, converting each byte to its corresponding character and then encoding the resulting binary string using `btoa()`.

*   **`decode(base64: string): Uint8Array`**
    *   **Purpose:** Decodes a base64 encoded string back into a `Uint8Array`.
    *   **Usage:** Used to reconstruct binary audio data from a base64 string received from an external source or storage.
    *   **Mechanism:** Uses `atob()` to decode the base64 string into a binary string, then converts each character back into its corresponding byte value to populate a `Uint8Array`.

*   **`createBlob(data: Float32Array): Blob`**
    *   **Purpose:** Creates a `Blob` object from `Float32Array` audio data, suitable for sending to the AI model.
    *   **Usage:** Prepares audio chunks for the AI model, converting floating-point audio samples to a format that can be encoded and transmitted.
    *   **Parameters:**
        *   `data`: A `Float32Array` containing audio samples, typically in the range of -1.0 to 1.0.
    *   **Mechanism:** 
        1.  Converts the `Float32Array` (range -1 to 1) to an `Int16Array` (range -32768 to 32767).
        2.  Creates a `Uint8Array` from the `Int16Array`'s buffer.
        3.  Encodes this `Uint8Array` using the `encode` function.
        4.  Returns an object conforming to the `Blob` interface, including the encoded data and a `mimeType` of `audio/pcm;rate=16000`.

*   **`decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer>`**
    *   **Purpose:** Decodes raw audio data (`Uint8Array`) into an `AudioBuffer` that can be played by the Web Audio API.
    *   **Usage:** Used to process audio data received from the AI model or other sources for playback.
    *   **Parameters:**
        *   `data`: The raw audio data as a `Uint8Array` (expected to be PCM 16-bit signed integers).
        *   `ctx`: The `AudioContext` instance.
        *   `sampleRate`: The sample rate of the audio data.
        *   `numChannels`: The number of audio channels.
    *   **Mechanism:** 
        1.  Creates an `AudioBuffer` with the specified number of channels and sample rate.
        2.  Interprets the `Uint8Array` as an `Int16Array`.
        3.  Converts the `Int16Array` data to `Float32Array` (range -1 to 1).
        4.  Interleaves the channel data if `numChannels` is greater than 0.
        5.  Copies the processed `Float32Array` data into the channels of the `AudioBuffer`.
        6.  Returns the populated `AudioBuffer`.

### Exported Members:

*   `createBlob`
*   `decode`
*   `decodeAudioData`
*   `encode`