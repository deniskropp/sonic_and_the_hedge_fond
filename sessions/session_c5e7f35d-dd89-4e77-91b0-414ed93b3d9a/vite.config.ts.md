## Vite Configuration (`vite.config.ts`)

This file configures the Vite build tool for the PromptDJ MIDI myfirstanalog project. Vite is a modern frontend build tool that aims to provide a faster and leaner development experience.

### Key Configurations:

*   **`define`**: This section allows you to globally replace values during the build process. It's used here to inject environment variables related to API keys into the application's build. Specifically:
    *   `'process.env.API_KEY'`: Injected with the value of `env.GEMINI_API_KEY`.
    *   `'process.env.GEMINI_API_KEY'`: Also injected with the value of `env.GEMINI_API_KEY`.
    This makes the Gemini API key available to the application at runtime via `process.env.GEMINI_API_KEY`.

*   **`server`**: Configures the development server:
    *   `port: 3000`: Sets the development server to run on port 3000.
    *   `host: '0.0.0.0'`: Allows the development server to be accessible from any IP address on your network, which is useful for testing on different devices.

*   **`plugins`**: An array for Vite plugins. Currently, this array is empty, indicating no additional Vite plugins are being used.

*   **`resolve.alias`**: Configures path aliases for module resolution:
    *   `'@': path.resolve(__dirname, '.')`: This creates an alias for the root directory of the project. Now, you can import modules from the project root using the `@` symbol (e.g., `import MyComponent from '@/components/MyComponent';`).

### Usage:

This configuration file is automatically picked up by Vite when you run commands like `npm run dev`, `npm run build`, or `npm run preview`. It ensures that the project is built and served with the correct settings, including environment variables and module path aliasing.