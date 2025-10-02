## Vite Configuration (`vite.config.ts`)

The `vite.config.ts` file configures the Vite build tool for the PromptDJ MIDI myfirstanalog project. It specifies server options, defines environment variables, and sets up path aliases for module resolution.

### Configuration Details:

*   **`server.port`**: Sets the development server to run on port `3000`.
*   **`server.host`**: Configures the development server to be accessible on all network interfaces (`0.0.0.0`).
*   **`plugins`**: An array for Vite plugins. Currently, this array is empty, indicating no additional plugins are configured.
*   **`define`**: This section injects environment variables into the client-side code. 
    *   `'process.env.GEMINI_API_KEY'`: Set to the value of `env.GEMINI_API_KEY`. This is the primary environment variable used for the Gemini API key.
*   **`resolve.alias`**: Configures path aliases for easier module importing.
    *   `'@'`: Aliased to the project's root directory (`path.resolve(__dirname, '.')`), allowing imports like `import MyComponent from '@/components/MyComponent';`.

### Environment Variables:

The configuration uses `loadEnv(mode, '.', '')` to load environment variables from `.env` files (e.g., `.env`, `.env.local`, `.env.development`) located in the project's root directory. The `GEMINI_API_KEY` is specifically loaded and made available to the client-side code. This ensures that sensitive keys are not hardcoded and can be managed securely per environment.