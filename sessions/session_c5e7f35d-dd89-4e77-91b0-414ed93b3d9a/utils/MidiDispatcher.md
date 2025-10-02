The `MidiDispatcher` class serves as a crucial abstraction layer for interacting with the Web MIDI API. It simplifies the process of connecting to MIDI devices, listening for specific MIDI messages, and dispatching them as custom events. This allows components to react to MIDI controller inputs without needing to manage the complexities of the underlying API directly.

### Core Functionality

*   **MIDI Access Management:** The class handles the asynchronous request for MIDI access using `navigator.requestMIDIAccess()`. It manages the `MIDIAccess` object and provides a list of available MIDI input device IDs. The `sysex: false` option is used during the request, which means System Exclusive messages will not be processed, simplifying the message handling logic.
*   **Device Selection:** It allows for the selection of a specific MIDI input device via the `activeMidiInputId` property. If multiple devices are available, the first one is automatically selected upon successful connection if `activeMidiInputId` is not already set.
*   **MIDI Message Processing:** It attaches an `onmidimessage` event listener to the selected MIDI input device. This listener filters incoming MIDI messages.
*   **Control Change (CC) Message Dispatching:** The dispatcher specifically identifies Control Change (CC) messages (status byte `0xb0` to `0xbf`). When a CC message is received from the active device, it extracts the channel, CC number (`data[1]`), and value (`data[2]`) and dispatches a custom `cc-message` event. The `event.detail` will contain an object conforming to the `ControlChange` interface.
*   **Device Name Retrieval:** Provides a method to get the user-friendly name of a MIDI device given its ID.

### Key Classes and Methods

*   **`MidiDispatcher` Class:**
    *   **`constructor()`:** Initializes the `MidiDispatcher` instance.
    *   **`activeMidiInputId: string | null`:** A public property that holds the ID of the currently active MIDI input device. Setting this property can switch the dispatcher's focus to a different device.
    *   **`async getMidiAccess(): Promise<string[]>`:** Asynchronously requests MIDI access. Returns a promise that resolves with an array of MIDI input device IDs. If access has already been granted, it returns the stored IDs immediately. It also sets up the `onmidimessage` listener for the active input.
    *   **`getDeviceName(id: string): string | null`:** Returns the name of the MIDI input device associated with the given `id`, or `null` if the device is not found or MIDI access is not yet established.

### Events

*   **`cc-message`:** Dispatched when a Control Change MIDI message is received from the active MIDI input device. The event detail is of type `ControlChange`.

### Usage Example

```typescript
import { MidiDispatcher } from './utils/MidiDispatcher';
import type { ControlChange } from './types';

// In your component or application setup:
const midiDispatcher = new MidiDispatcher();

async function initializeMidi() {
  try {
    const inputIds = await midiDispatcher.getMidiAccess();
    console.log('Available MIDI inputs:', inputIds);
    // Optionally, set a specific input if needed:
    // if (inputIds.length > 0) {
    //   midiDispatcher.activeMidiInputId = inputIds[0];
    // }
  } catch (error) {
    console.error('Failed to initialize MIDI:', error);
    // Display an error message to the user
  }
}

// Add an event listener for CC messages:
midiDispatcher.addEventListener('cc-message', (event: Event) => {
  const customEvent = event as CustomEvent<ControlChange>;
  const { channel, cc, value } = customEvent.detail;
  console.log(`MIDI CC: Channel=${channel}, CC=${cc}, Value=${value}`);
  // Handle the CC message, e.g., map it to a control
});

// Call initializeMidi() when the application is ready or user interaction occurs
initializeMidi();
```

### Error Handling

The class includes robust error handling for:

*   Browsers lacking Web MIDI API support.
*   Failures during the MIDI access request.
*   Situations where MIDI messages might not contain expected data.