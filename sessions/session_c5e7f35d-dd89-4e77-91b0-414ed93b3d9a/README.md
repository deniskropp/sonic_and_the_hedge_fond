## PromptDJ MIDI myfirstanalog

<div align="center">

<img width="1200" height="475" alt="PromptDJ MIDI myfirstanalog Project Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>Built with AI Studio</h1>

  <p>The fastest path from prompt to production with Gemini.</p>

  <a href="https://aistudio.google.com/apps">Start building</a>

</div>

## Overview

PromptDJ MIDI myfirstanalog is a creative application that allows you to control real-time music generation using a MIDI controller. It leverages AI Studio and Gemini to dynamically generate and manipulate musical prompts based on your MIDI inputs.

## Features

*   **Real-time Music Generation:** Control music generation on the fly.
*   **MIDI Controller Integration:** Map MIDI control changes (CC) to adjust prompt weights.
*   **AI-Powered Prompts:** Utilizes Gemini's capabilities for creative music generation.
*   **Interactive UI:** A visual interface with prompt controllers, play/pause buttons, and MIDI feedback.
*   **Customizable Prompts:** Define and manage multiple musical prompts with adjustable weights and colors.

## Setup and Running the Project

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn
*   A MIDI controller (optional, but highly recommended for full functionality)
*   A Gemini API Key (required for AI music generation)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/promptdj-midi-myfirstanalog.git
    ```
    *(Replace `https://github.com/your-username/promptdj-midi-myfirstanalog.git` with the actual repository URL.)*

2.  **Navigate to the project directory:**
    ```bash
    cd promptdj-midi-myfirstanalog
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project directory and add your Gemini API Key:
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
    *Note: Ensure your API key is kept confidential and is not committed to version control.* The application requires this key to interact with the Gemini API for music generation.

### Running the Development Server

To start the development server, run:

```bash
npm run dev
# or
yarn dev
```

This will launch the application on `http://localhost:3000` (or the port specified in `vite.config.ts`).

## Usage

1.  **Launch the application:** Open your web browser and navigate to the address provided by the development server (usually `http://localhost:3000`).

2.  **MIDI Controller Setup:**
    *   Click the "MIDI" button to reveal MIDI input options.
    *   Select your MIDI controller from the dropdown list. If no devices are found, ensure your controller is connected and recognized by your system.

3.  **Controlling Prompts:**
    *   Each prompt controller has a **Weight Knob**. You can adjust the weight of a prompt by dragging the knob or using your mouse wheel.
    *   To map a MIDI CC to a prompt's weight, click the "MIDI" button to enable MIDI input display, then click the "Learn" label on the desired prompt controller. Send a CC message from your MIDI controller, and the prompt will automatically map to that CC.
    *   The "Learn" label will change to display the mapped `CC: [number]`.
    *   Without a MIDI controller, you can still adjust prompt weights manually using the knobs, but real-time dynamic control will be limited.

4.  **Playback Control:**
    *   Use the **Play/Pause button** to start, pause, or stop the music generation process.
    *   The button's state will indicate the current playback status (Stopped, Loading, Playing, Paused).

## Project Structure

*   **`src/`**: Contains the main application source code.
    *   **`components/`**: LitElement components for UI elements (e.g., `PromptController`, `PlayPauseButton`).
    *   **`types.ts`**: Defines TypeScript interfaces and types used throughout the project.
    *   **`utils/`**: Utility functions and classes for audio processing, MIDI handling, and AI interaction.
*   **`index.tsx`**: The main entry point of the application, responsible for initializing components and setting up event listeners.
*   **`vite.config.ts`**: Vite build tool configuration.

## Configuration (`vite.config.ts`)

This project uses Vite for its build process. The `vite.config.ts` file configures the development server and build settings. Key configurations include:

*   `server.port`: Sets the development server port (default: 3000).
*   `server.host`: Sets the development server host (default: '0.0.0.0', making it accessible on your local network).
*   `plugins`: An array for Vite plugins (currently empty).
*   `define`: Used to inject environment variables (like `GEMINI_API_KEY`) into the client-side build.
*   `resolve.alias`: Configures path aliases for cleaner imports (e.g., `@` for the root directory).

## Contributing

Contributions are welcome! Please refer to the `CONTRIBUTING.md` file (if available) for guidelines on how to contribute.

## License

This project is licensed under the Apache-2.0 license.
