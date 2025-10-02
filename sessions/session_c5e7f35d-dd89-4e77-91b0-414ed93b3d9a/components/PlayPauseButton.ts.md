## `components/PlayPauseButton.ts` Documentation

This component provides a visual toggle button for controlling playback state (play, pause, loading). It is implemented as a LitElement web component.

### Functionality

The `PlayPauseButton` component renders an SVG icon that changes its appearance based on the `playbackState` property. It supports three states:

*   **'stopped'**: Displays a play icon.
*   **'playing'**: Displays a pause icon.
*   **'loading'**: Displays a spinning loader icon.

Clicking the button (via its interactive hitbox) dispatches a `click` event, which can be handled by the parent component to control the application's playback.

### Properties

*   **`playbackState`**: (Type: `PlaybackState`) 
    *   Description: Represents the current playback status of the application.
    *   Accepted values: `'stopped'`, `'playing'`, `'loading'`, `'paused'`.
    *   Default: `'stopped'`.
    *   Usage: This property drives the visual state of the button.

### Rendering Logic

The component utilizes LitElement's templating to render an SVG graphic. The `renderIcon()` method is responsible for selecting and returning the appropriate SVG path based on the `playbackState` property:

*   The main SVG structure provides a circular background with subtle shadow effects.
*   The `renderPlay()`, `renderPause()`, and `renderLoading()` methods return specific SVG path data for each state.
*   A transparent `div` with the class `hitbox` is overlaid on the SVG to capture pointer events, making the entire button area clickable.
*   CSS styles are applied to control the button's appearance, hover effects, and the animation of the loader.

### Usage Example (in parent component):

```html
<play-pause-button .playbackState="${this.currentPlaybackState}"
                 @click="${this.handlePlayPauseClick}"></play-pause-button>
```

```typescript
// In the parent component's class:

import './components/PlayPauseButton';
import type { PlaybackState } from './types';

// ...

@property({ type: String })
currentPlaybackState: PlaybackState = 'stopped';

handlePlayPauseClick() {
  // Logic to toggle playback
  console.log('Play/Pause button clicked!');
}
// ...
```