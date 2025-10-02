## `index.tsx` - Application Entry Point and Setup

This file serves as the main entry point for the PromptDJ MIDI myfirstanalog application. It orchestrates the initialization of core components, establishes event listeners for communication between them, and configures the underlying AI and audio processing modules.

### Core Functionality

1.  **Initialization of AI and Audio Modules:**
    *   An instance of `GoogleGenAI` is created, configured with an API key loaded from environment variables (`process.env.GEMINI_API_KEY`). **Security Note:** API keys should always be managed securely and never committed directly to version control. Environment variables are utilized here for this purpose.
    *   The `lyria-realtime-exp` model is selected for music generation.
    *   `LiveMusicHelper` is instantiated to manage the interaction with the AI model, audio processing, and playback control.
    *   `AudioAnalyser` is created to monitor audio levels. Its output node is connected to the `LiveMusicHelper` via `extraDestination` to enable real-time audio level monitoring.

2.  **Component Instantiation and Appending:**
    *   The primary UI component, `PromptDjMidi`, is instantiated with initial prompts and appended to the document body.
    *   A `ToastMessage` component is instantiated for displaying user notifications and also appended to the document body.

3.  **Event Handling and Component Communication:**
    *   **`prompts-changed` Event:** Listens for changes in prompts from `PromptDjMidi`. When detected, it updates the `LiveMusicHelper` with the latest prompt configurations.
    *   **`play-pause` Event:** Listens for the play/pause action from `PromptDjMidi` and delegates it to `LiveMusicHelper`.
    *   **`playback-state-changed` Event:** Listens for changes in the playback state from `LiveMusicHelper`. It updates the `PromptDjMidi`'s playback state and controls the `AudioAnalyser` (starting it when playing, stopping it when not).
    *   **`filtered-prompt` Event:** Listens for filtered prompts from `LiveMusicHelper`. It displays a notification using `ToastMessage` and adds the prompt to the `PromptDjMidi`'s filtered list.
    *   **`error` Event:** Catches errors from both `LiveMusicHelper` and `PromptDjMidi`, displaying them to the user via `ToastMessage`.
    *   **`audio-level-changed` Event:** Listens for audio level updates from `AudioAnalyser` and propagates them to `PromptDjMidi` to update its UI (likely for visual feedback on knobs).

### Initial Prompt Setup (`buildInitialPrompts`)

*   This function generates the initial set of prompts used when the application loads.
*   It selects three random prompts from a predefined list (`DEFAULT_PROMPTS`) to be initially active (weight of 1).
*   The remaining prompts are initialized with a weight of 0.
*   Each prompt is assigned a unique `promptId`, its `text`, `weight`, `cc` (MIDI Continuous Controller number, mapped sequentially to the prompt index), and `color`.
*   These prompts are stored in a `Map` and returned.

### `DEFAULT_PROMPTS`

A constant array defining the default prompts, each with a `color` and `text` description. This list serves as the source for generating the initial prompts and provides the basis for the AI's musical context.

### Usage

This file is executed automatically when the application is loaded in a browser environment. It sets up the entire application by:
1.  Creating and appending the main UI and notification components.
2.  Initializing the AI and audio processing backend.
3.  Establishing the communication channels (event listeners) between the UI and the backend logic.
1.  Calling `buildInitialPrompts` to prepare the initial state of the music generation prompts.

It represents the core bootstrapping mechanism of the PromptDJ MIDI myfirstanalog application.

**Note on Environment Variables:** The API key is loaded via `process.env.GEMINI_API_KEY`. Vite typically uses `import.meta.env` for environment variables; ensure that `process.env` is correctly configured or polyfilled in the build process for this project if `process.env` is indeed the intended method of access in the final bundle.

**Note on Event Handling:** Type assertions (e.g., `e as CustomEvent<...>`) are used within event listeners to provide specific type information for event details. This is a common practice in TypeScript for enhancing type safety and clarity when dealing with custom events.