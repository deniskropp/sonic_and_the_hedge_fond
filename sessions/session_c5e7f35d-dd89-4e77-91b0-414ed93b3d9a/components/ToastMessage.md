## ToastMessage Component Documentation Revision

The `ToastMessage` component is a custom LitElement web component designed to display temporary, non-intrusive user notifications (toasts) within the application. It is positioned fixedly at the top-center of the viewport and can be automatically dismissed or manually closed by the user.

### Purpose

To provide essential feedback to the user about application status, errors, or confirmations without disrupting their current workflow. This component is crucial for informing users about events such as MIDI connection issues, AI prompt filtering, or other brief status updates.

### Features

*   **Dynamic Messaging:** Accepts a `message` property of type `string`. This string can contain URLs, which are automatically detected and rendered as clickable `<a>` elements using the `renderMessageWithLinks` internal method and a regular expression `/(https?:\/\/[^\s]+)/g`.
*   **Visibility Control:** Managed by the `showing` boolean property. When `true`, the toast is displayed and animated in; when `false`, it animates out and is effectively hidden.
*   **Animated Transitions:** Leverages CSS transitions for smooth entry and exit animations. The animation uses a `cubic-bezier` timing function (`0.19, 1, 0.22, 1`) and is controlled by the `.toast:not(.showing)` CSS class for the exit animation.
*   **Manual Dismissal:** Provides a close button ('✕') that triggers the `hide()` method for immediate user dismissal.
*   **Automatic Dismissal:** The toast automatically animates out when the `showing` property is set to `false`.
*   **Styling:** The component is styled to be fixed at the top-center of the viewport, with a dark background, white text, and distinct border and shadow for clear visibility.

### Properties

*   `message`: `string` - The content of the toast notification. URLs within this string will be rendered as hyperlinks.
*   `showing`: `boolean` - A flag that controls the visibility and animation state of the toast. `true` displays the toast; `false` initiates the dismissal animation.

### Methods

*   `show(message: string)`: Public method to display the toast with the specified `message`. Sets the `showing` property to `true` and updates the `message` property.
*   `hide()`: Public method to dismiss the toast. Sets the `showing` property to `false`, which triggers the exit animation.

### Internal Implementation Details

*   The `renderMessageWithLinks()` method is a private helper responsible for parsing the `message` string and converting any detected URLs into interactive `<a>` elements.
*   The CSS styling utilizes `position: fixed`, `transform: translateX(-50%)` for centering, and `transition` properties for animating the toast's appearance and disappearance.
