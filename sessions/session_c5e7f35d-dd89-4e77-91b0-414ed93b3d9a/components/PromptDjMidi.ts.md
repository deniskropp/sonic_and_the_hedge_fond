## Component: `PromptDjMidi`

### Purpose

The `PromptDjMidi` component orchestrates the user interface for the real-time music generation application. It displays a grid of individual prompt controllers, manages global playback controls, and facilitates MIDI device selection and connection.

### Grid Layout

- The component renders a grid of `prompt-controller` elements.
- The grid is configured to have 4 columns (`grid-template-columns: repeat(4, 1fr);`) and a defined gap (`gap: 2.5vmin;`).
- The overall grid container (`#grid`) is responsive, with its size determined by `80vmin` for both width and height.
- Each `prompt-controller` within the grid is styled to occupy its grid cell effectively (`width: 100%;`).

### Prompt Management

- The component maintains an internal `Map` called `prompts` to store the state of each prompt (e.g., text, weight, color, associated MIDI CC).
- It listens for `prompt-changed` events emitted by individual `prompt-controller` components. When a prompt's properties are updated, this component updates its internal `prompts` map and dispatches a `prompts-changed` event to inform other parts of the application (like `LiveMusicHelper`).
- The `makeBackground` method generates dynamic radial gradients for the component's background. These gradients visually represent the weights of active prompts, with brighter and larger gradients indicating higher weights. The `alphaPct` and `stop` values are directly tied to `p.weight`, with `MAX_WEIGHT` and `MAX_ALPHA` constants controlling the maximum visual influence.

### MIDI Input Handling

- The component integrates with the `MidiDispatcher` utility to handle MIDI input.
- It provides a UI section (toggleable via a 'MIDI' button) to:
  - List available MIDI input devices.
  - Allow the user to select an active MIDI input device.
  - Display the selected device's name.
- If no MIDI devices are found, a corresponding message is shown.
- If the browser does not support the Web MIDI API, an error message will be displayed.
- The `setShowMidi` method is responsible for requesting MIDI access and updating the list of available input IDs.

### Playback Controls

- A `play-pause-button` component is rendered, displaying the current `playbackState` ('stopped', 'playing', 'loading', 'paused').
- Clicking the `play-pause-button` dispatches a `play-pause` event to the parent application, triggering the music playback or pause action.

### Styling and Responsiveness

- The component uses CSS custom properties and `vmin` units to ensure a degree of responsiveness.
- The background is dynamically generated using radial gradients based on prompt weights, providing a visual feedback mechanism.
- Specific styles are applied for the MIDI selection dropdown and the 'MIDI' button to indicate its active state.

### Properties

- `showMidi`: (Boolean) Controls the visibility of the MIDI device selection UI.
- `playbackState`: (PlaybackState) Reflects the current playback status (e.g., 'playing', 'stopped').
- `audioLevel`: (Number) Represents the current audio input level, used for visual feedback in `prompt-controller` components.
- `midiInputIds`: (Array<string>) Stores the IDs of available MIDI input devices.
- `activeMidiInputId`: (String | null) Stores the ID of the currently selected MIDI input device.
- `filteredPrompts`: (Set<string>) A set of prompt texts that are currently filtered out by the AI. This property is used to visually indicate filtered prompts in the `prompt-controller` components by applying a specific style when a prompt's text is present in this set.
- `prompts`: (Map<string, Prompt>) Internal state holding all prompt data.
- `midiDispatcher`: (MidiDispatcher) An instance of the `MidiDispatcher` for handling MIDI messages.

### Events

- `prompts-changed`: Dispatched when the properties of any prompt are updated. The event detail contains the updated `Map<string, Prompt>`, which is crucial for updating the AI model's context.
- `play-pause`: Dispatched when the play/pause button is clicked.
- `error`: Dispatched when an error occurs (e.g., MIDI connection issues).