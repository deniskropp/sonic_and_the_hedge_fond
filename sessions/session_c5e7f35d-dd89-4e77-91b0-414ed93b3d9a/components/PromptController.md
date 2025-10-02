## Component: PromptController

### Purpose

The `PromptController` component is a custom web component responsible for managing individual music prompts within the PromptDJ MIDI application. It provides a user interface for editing prompt text, adjusting its associated weight (which influences its prominence in the AI-generated music), and mapping it to a MIDI Continuous Controller (CC) message for real-time control. It also visualizes the prompt's weight and provides a mechanism for entering 'learn mode' to assign MIDI CCs.

### Functionality

*   **Prompt Text Input:** Allows users to enter and edit the text for a specific musical prompt. It supports editing directly within the component and includes keyboard shortcuts for saving (Enter) and resetting (Escape).
*   **Weight Adjustment:** Integrates with a `WeightKnob` component to visually represent and allow adjustment of the prompt's weight. The weight is a numerical value that influences how strongly the AI considers this prompt. The `audioLevel` property is passed to the `WeightKnob` to potentially influence its visualization.
*   **MIDI CC Mapping:** Enables users to map a MIDI CC message to control the prompt's weight. When in 'learn mode,' the component listens for incoming CC messages and assigns the received CC number to the prompt. Clicking the 'MIDI' button toggles `learnMode`. The `cc` property is updated after a CC message is received while in learn mode.
*   **Visual Feedback:**
    *   The `WeightKnob` component visually indicates the current weight and can optionally display an audio level.
    *   The component itself can be visually `filtered` (indicated by a red background on the text input and reduced opacity on the knob) if the AI deems the prompt unsuitable.
    *   The 'MIDI' button displays the currently mapped CC number or 'Learn' when in learn mode.
*   **Event Emission:**
    *   `prompt-changed`: Emits a custom event whenever the prompt's text, weight, CC, or color changes. This event carries the updated `Prompt` object.

### Properties

*   `promptId` (String): A unique identifier for the prompt.
*   `text` (String): The text content of the prompt.
*   `weight` (Number): The current weight of the prompt (typically between 0 and 2).
*   `color` (String): The color associated with the prompt, used for visual styling.
*   `filtered` (Boolean, reflect): Indicates if the prompt has been filtered by the AI. This affects the component's styling.
*   `cc` (Number): The MIDI CC number currently mapped to this prompt.
*   `channel` (Number): The MIDI channel mapped to this prompt. This property is available but not currently used in the component's logic; it may be a remnant or intended for future use.
*   `learnMode` (Boolean): A flag to indicate if the component is currently in MIDI CC learn mode.
*   `showCC` (Boolean): Controls the visibility of the MIDI CC display and learn mode toggle.
*   `midiDispatcher` (MidiDispatcher | null): An instance of `MidiDispatcher` used to listen for incoming MIDI CC messages.
*   `audioLevel` (Number): The current audio analysis level, passed to the `WeightKnob` to potentially influence its visualization.

### Methods

*   `connectedCallback()`: Initializes event listeners for MIDI CC messages when the component is added to the DOM. It handles updating the prompt's weight based on received CC values or updating the mapped CC when in learn mode.
*   `firstUpdated()`: Sets up the `contenteditable` attribute for the text input and initializes its content.
*   `update(changedProperties)`: Handles updates to properties. It ensures the text input reflects the `text` property by setting `this.textInput.textContent = this.text;` and manages the `learnMode` state when `showCC` changes.
*   `dispatchPromptChange()`: A private method to dispatch the `prompt-changed` custom event with the current prompt details.
*   `onKeyDown(e: KeyboardEvent)`: Handles keyboard events for the text input, specifically for 'Enter' to save and 'Escape' to reset.
*   `resetText()`: Resets the prompt text to its last valid state.
*   `updateText()`: Updates the prompt's text property and dispatches the `prompt-changed` event after the user finishes editing.
*   `onFocus()`: Selects the content of the text input when it gains focus.
*   `updateWeight()`: Updates the prompt's weight based on input from the `WeightKnob` and dispatches the `prompt-changed` event.
*   `toggleLearnMode()`: Toggles the `learnMode` property.

### Usage Example

```html
<prompt-controller
  promptId="prompt-0"
  text="Bossa Nova"
  weight="1.5"
  color="#9900ff"
  .midiDispatcher=${midiDispatcherInstance} // Placeholder for an actual MidiDispatcher instance
  ?showCC=${true}
  @prompt-changed=${handlePromptChange}> // Placeholder for an event handler function
</prompt-controller>
```

This component is crucial for allowing users to define and control the various musical elements that the AI will generate, providing a direct link between MIDI input and the creative output.