## Component: WeightKnob

### Purpose

The `WeightKnob` component serves as an interactive control for adjusting and visualizing the "weight" of a prompt. It provides a visual representation of the prompt's importance or influence, allowing users to intuitively modify this value.

### Visual Representation

-   **Knob Interface**: A circular knob interface is used for adjusting the weight. The current value is indicated by a pointer that rotates around the knob.
-   **Halo Effect**: A colored halo surrounds the knob. Its size is dynamically adjusted based on:
    -   The current `value` of the knob (representing prompt weight).
    -   The `audioLevel` input, which can further scale the halo.
    -   The halo is visible only when the `value` is greater than 0.
-   **Static Elements**: The component includes several static SVG elements that create a layered, visual depth for the knob.

### Interactive Features

-   **Pointer Interaction**: Users can click and drag on the knob to adjust its `value`. The component tracks the interaction to calculate the change in `value`.
-   **Wheel Interaction**: Mouse wheel events can also be used to adjust the knob's `value`.
-   **Value Clamping**: The `value` is constrained between 0 and 2. This range is chosen to represent a specific weighting scale for AI prompt generation.

### Properties

- `value` (Number): The current weight value, ranging from 0 to 2. Defaults to 0.
- `color` (String): The color of the halo when the prompt is active. Defaults to '#000'.
- `audioLevel` (Number): A value representing the current audio level, used to modify the halo's scale. Defaults to 0.

### Events

- `input` (CustomEvent<number>): Fired whenever the `value` of the knob changes due to user interaction (drag or wheel). The event detail contains the new `value`.

### Usage Example

```html
<weight-knob
  value="0.5"
  color="#9900ff"
  audioLevel="0.3"
  @input="(e) => console.log('Weight changed:', e.detail)">
</weight-knob>
```