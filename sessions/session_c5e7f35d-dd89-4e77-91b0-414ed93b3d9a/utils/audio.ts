/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import type { Blob } from '@google/genai';

/**
 * Encodes a Uint8Array into a Base64 string.
 * @param bytes The byte array to encode.
 * @returns The Base64 encoded string.
 */
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a Base64 string into a Uint8Array.
 * @param base64 The Base64 string to decode.
 * @returns The decoded byte array.
 */
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Creates a Blob-like object for AI model audio input.
 * Converts Float32Array audio data to Int16Array, then encodes it to Base64.
 * @param data The audio data as a Float32Array.
 * @returns A Blob-like object with encoded data and MIME type.
 */
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // convert float32 -1 to 1 to int16 -32768 to 32767
    int16[i] = data[i] * 32768;
  }

  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

/**
 * Decodes raw audio data (PCM 16-bit signed integers) into an AudioBuffer.
 * @param data The raw audio data as a Uint8Array.
 * @param ctx The AudioContext to use for creating the buffer.
 * @param sampleRate The sample rate of the audio data.
 * @param numChannels The number of audio channels.
 * @returns A Promise that resolves with the decoded AudioBuffer.
 */
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // Calculate the number of samples per channel
  const frameCount = data.length / (numChannels * 2); // 2 bytes per sample (16-bit)
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  const dataInt16 = new Int16Array(data.buffer);
  const l = dataInt16.length;
  const dataFloat32 = new Float32Array(l);
  for (let i = 0; i < l; i++) {
    dataFloat32[i] = dataInt16[i] / 32768.0;
  }
  // Extract interleaved channels and copy to buffer channels
  for (let i = 0; i < numChannels; i++) {
    const channelSamples = new Float32Array(frameCount);
    for (let j = 0; j < frameCount; j++) {
      channelSamples[j] = dataFloat32[j * numChannels + i];
    }
    buffer.copyToChannel(channelSamples, i);
  }

  return buffer;
}

export {createBlob, decode, decodeAudioData, encode};
