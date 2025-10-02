## Component: PlayPauseButton

### Purpose

The `PlayPauseButton` component is a custom HTML element (`<play-pause-button>`) that visually represents the playback state of the music player and allows users to control it via a click interaction. It utilizes LitElement for its framework and SVG for its graphical representation.

### Functionality

This component displays one of three icons based on the `playbackState` property:

*   **`'playing'`**: Displays a pause icon.
*   **`'loading'`**: Displays a spinning loader icon.
*   **`'stopped'`** (and `'paused'`): Displays a play icon.

Clicking the button triggers a `click` event, which can be used by a parent component to control the playback.

### Properties

*   **`playbackState`**: (Type: `PlaybackState`, Default: `'stopped'`) 
    The current state of the music playback. This property determines which icon is displayed.
    Accepted values are: `'stopped'`, `'playing'`, `'loading'`, and `'paused'`.

### Events

*   **`click`**: Dispatched when the button is clicked. This event does not carry any specific data in its `detail` property.

### Styling

The component includes internal styles for:

*   Centering the icon within the host element.
*   A hover effect that scales the SVG.
*   A spinning animation for the loader icon.
*   A `hitbox` div to make the entire clickable area responsive.

### Usage Example

```html
<play-pause-button playback-state="playing"></play-pause-button>

<script>
  const button = document.querySelector('play-pause-button');
  button.addEventListener('click', () => {
    console.log('Play/Pause button clicked!');
    // Add logic here to toggle playback
  });
  // To change the state dynamically:
  // button.playbackState = 'loading';
</script>
```