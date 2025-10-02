## `MidiDispatcher` Class

The `MidiDispatcher` class simplifies interaction with the Web MIDI API by abstracting its complexities, providing a cleaner interface for the application.

### Purpose

Its primary purpose is to:

1.  **Request and manage MIDI access:** Handles the process of requesting permission to access MIDI devices from the browser.
2.  **Listen for MIDI messages:** Attaches event listeners to MIDI input devices to capture incoming messages.
3.  **Filter and dispatch CC messages:** Specifically identifies and processes MIDI Control Change (CC) messages, re-dispatching them as custom `cc-message` events. This allows other components to react to MIDI controller inputs without needing to directly manage the low-level MIDI API.

### Key Features and Functionality

*   **`getMidiAccess()`:**
    *   Asynchronously requests access to MIDI devices using `navigator.requestMIDIAccess({ sysex: false })`. The `sysex: false` option prevents the reception of System Exclusive messages, simplifying message handling.
    *   Throws an error if the browser does not support the Web MIDI API or if access is denied.
    *   Initializes `this.access` with the `MIDIAccess` object upon successful connection.
    *   Returns a promise that resolves with an array of MIDI input device IDs (strings).
    *   If `activeMidiInputId` is not yet set and MIDI devices are available, it automatically sets `activeMidiInputId` to the ID of the first device in the list.
    *   Iterates through available MIDI input devices (`this.access.inputs.values()`) and attaches an `onmidimessage` event handler to each.

*   **`activeMidiInputId` Property:**
    *   A public property of type `string | null`. It stores the ID of the MIDI input device that the dispatcher is currently listening to. This allows the application to dynamically switch the active MIDI controller.

*   **`onmidimessage` Event Handler:**
    *   This callback is triggered whenever a MIDI message is received from a connected input device.
    *   It first checks if the incoming message is from the `activeMidiInputId`. If not, the message is ignored.
    *   It then inspects the MIDI message's status byte (`data[0]`) to determine the message type and channel. The structure of `data` is typically `[statusByte, data1, data2, ...]`. For CC messages, `data1` is the CC number and `data2` is the value.
    *   It specifically filters for Control Change (CC) messages, identified by a status byte starting with `0xb0` (when channel is considered, it's `0xb0` to `0xbf`).
    *   If a CC message is detected, it constructs a `ControlChange` object containing the `channel`, `cc` number (`data[1]`), and `value` (`data[2]`).
    *   Dispatches a custom event named `cc-message` with the `ControlChange` object as `event.detail`.

*   **`getDeviceName(id: string)`:**
    *   Retrieves the user-friendly name of a MIDI device given its ID by accessing `this.access.inputs.get(id)?.name`.
    *   Returns `null` if `this.access` is not yet initialized or if the ID is not found.

### Usage Example

To use `MidiDispatcher` in a component:

1.  **Instantiate:**
    ```typescript
    import { MidiDispatcher } from '../utils/MidiDispatcher';
    // Assuming this is within a LitElement component or similar context
    private midiDispatcher = new MidiDispatcher();
    ```

2.  **Request MIDI Access and Listen for CC Messages:**
    ```typescript
    // In a LitElement component's connectedCallback or similar lifecycle method:
    async connectedCallback() {
      super.connectedCallback();
      try {
        const inputIds = await this.midiDispatcher.getMidiAccess();
        console.log('Available MIDI inputs:', inputIds);
        // If you want to explicitly set a device, you can do so here:
        // if (inputIds.length > 0) {
        //   this.midiDispatcher.activeMidiInputId = inputIds[0]; 
        // }
      } catch (e: any) {
        console.error('Failed to get MIDI access:', e.message);
        // Optionally display an error to the user via a toast message
      }

      this.midiDispatcher.addEventListener('cc-message', (e: Event) => {
        const customEvent = e as CustomEvent<ControlChange>;
        const { channel, cc, value } = customEvent.detail;
        console.log(`Received CC message: Channel=${channel}, CC=${cc}, Value=${value}`);
        // Handle the MIDI CC message here, e.g., update component state
      });
    }
    ```

### Error Handling

The class includes error handling for:

*   Browsers that do not support the Web MIDI API.
*   Failure to acquire MIDI access.
*   MIDI messages missing data.

Errors during `navigator.requestMIDIAccess` are caught and re-thrown as `Error` objects with descriptive messages.
