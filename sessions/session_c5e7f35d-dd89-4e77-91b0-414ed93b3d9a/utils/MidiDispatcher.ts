/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import type { ControlChange } from '../types';

/** Simple class for dispatching MIDI CC messages as events. */
export class MidiDispatcher extends EventTarget {
  private access: MIDIAccess | null = null;
  activeMidiInputId: string | null = null;

  /**
   * Asynchronously requests access to MIDI devices.
   * @returns A Promise that resolves with an array of MIDI input device IDs.
   * @throws Error if the browser does not support the Web MIDI API or if access is denied.
   */
  async getMidiAccess(): Promise<string[]> {

    if (this.access) {
      // If access is already granted, return the existing input IDs.
      return [...this.access.inputs.keys()];
    }

    // Check for browser support for the Web MIDI API.
    if (!navigator.requestMIDIAccess) {
      throw new Error('Your browser does not support the Web MIDI API. For a list of compatible browsers, see https://caniuse.com/midi');
    }

    // Request MIDI access, disabling System Exclusive messages for simplicity.
    this.access = await navigator
      .requestMIDIAccess({ sysex: false })
      .catch((error) => {
        // Catch and re-throw any errors during the request.
        throw new Error(`Failed to acquire MIDI access: ${error.message || error}`);
      });

    // Ensure access was granted.
    if (!this.access) {
      throw new Error('Unable to acquire MIDI access.');
    }

    const inputIds = [...this.access.inputs.keys()];

    // Automatically select the first input device if none is active.
    if (inputIds.length > 0 && this.activeMidiInputId === null) {
      this.activeMidiInputId = inputIds[0];
    }

    // Attach event listeners to each MIDI input.
    for (const input of this.access.inputs.values()) {
      input.onmidimessage = (event: MIDIMessageEvent) => {
        // Only process messages from the currently active input.
        if (input.id !== this.activeMidiInputId) return;

        const { data } = event;
        if (!data) {
          console.error('MIDI message has no data');
          return;
        }

        const statusByte = data[0];
        const channel = statusByte & 0x0f; // Extract channel (0-15)
        const messageType = statusByte & 0xf0; // Extract message type (e.g., 0x90 for Note On, 0xB0 for Control Change)

        // Filter for Control Change messages (0xB0).
        const isControlChange = messageType === 0xb0;
        if (!isControlChange) return;

        // Construct the ControlChange event detail.
        // data[1] is the CC number, data[2] is the value.
        const detail: ControlChange = { cc: data[1], value: data[2], channel };
        
        // Dispatch a custom 'cc-message' event.
        this.dispatchEvent(
          new CustomEvent<ControlChange>('cc-message', { detail }),
        );
      };
    }

    // Return the list of available input IDs.
    return inputIds;
  }

  /**
   * Retrieves the user-friendly name of a MIDI input device.
   * @param id The ID of the MIDI input device.
   * @returns The name of the device, or null if not found or access is not established.
   */
  getDeviceName(id: string): string | null {
    if (!this.access) {
      // Return null if MIDI access has not been granted yet.
      return null;
    }
    const input = this.access.inputs.get(id);
    return input ? input.name : null;
  }
}
