## `utils/audio.ts` Documentation

This module provides utility functions for handling audio data, specifically for encoding, decoding, and creating a data structure compatible with the AI library's audio input requirements.

### Functions:

*   **`encode(bytes: Uint8Array): string`**
    *   **Purpose:** Converts a `Uint8Array` into a Base64 encoded string.
    *   **Mechanism:** Iterates through the byte array, converting each byte to its corresponding character and concatenating them into a binary string, which is then Base64 encoded using `btoa()`.
    *   **Usage:** Typically used to serialize binary audio data into a string format suitable for transmission or storage, such as within JSON payloads for API requests.

*   **`decode(base64: string): Uint8Array`**
    *   **Purpose:** Decodes a Base64 encoded string back into a `Uint8Array`.
    *   **Mechanism:** Decodes the Base64 string into a binary string using `atob()`, then creates a `Uint8Array` from the character codes of the binary string.
    *   **Usage:** Used to deserialize audio data that was previously encoded and transmitted as a Base64 string.

*   **`createBlob(data: Float32Array): Blob`**
    *   **Purpose:** Converts `Float32Array` audio data into a structure compatible with the `@google/genai` library's audio input format.
    *   **Mechanism:** 
        1.  Converts the input `Float32Array` (typically ranging from -1.0 to 1.0) into an `Int16Array` (ranging from -32768 to 32767).
        2.  Creates a `Uint8Array` from the buffer of the `Int16Array`.
        3.  Encodes this `Uint8Array` using the `encode` function.
        4.  Returns an object with the encoded `data` and a fixed `mimeType` of `audio/pcm;rate=16000`.
    *   **Note:** The returned `Blob` is a custom object structure for the AI library, not a standard browser `Blob` object.
    *   **Usage:** Prepares audio data for sending to the AI model, ensuring the correct format and encoding.

*   **`decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer>`**
    *   **Purpose:** Decodes raw audio data (expected to be PCM 16-bit signed integers) into an `AudioBuffer` object.
    *   **Mechanism:** 
        1.  Creates an `AudioBuffer` with the specified `numChannels`, calculated length, and `sampleRate`.
        2.  Interprets the input `Uint8Array` as an `Int16Array`.
        3.  Converts the `Int16Array` samples to `Float32Array` samples normalized to the range [-1.0, 1.0].
        4.  De-interleaves the samples for each channel and copies them into the respective channels of the `AudioBuffer`.
    *   **Usage:** Converts received audio data into a format that can be played back or further processed by the Web Audio API.

### Notes:

*   The `createBlob` function's `mimeType` is hardcoded to `audio/pcm;rate=16000`. This sample rate is specific to the expected input format of the AI model.
*   The `decodeAudioData` function assumes the input `data` is in 16-bit signed integer PCM format. The calculation `data.length / 2 / numChannels` determines the number of samples per channel by first converting bytes to samples (`data.length / 2`) and then dividing by the number of channels. The calculation for `frameCount` has been updated to `data.length / (numChannels * 2)` for accuracy.
