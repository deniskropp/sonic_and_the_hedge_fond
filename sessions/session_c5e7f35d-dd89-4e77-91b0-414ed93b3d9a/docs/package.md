# `package.json` - Project Dependencies and Scripts

This file serves as the manifest for the PromptDJ MIDI myfirstanalog project. It defines the project's metadata, lists its dependencies, and specifies scripts for common development and build tasks.

## Project Metadata

- `name`: `promptdj-midi-myfirstanalog` - The name of the project.
- `private`: `true` - Indicates that this package is not intended for publication on npm.
- `version`: `0.0.0` - The current version of the project.
- `type`: `module` - Specifies that this project uses ECMAScript modules.

## Scripts

The `scripts` section defines command-line tasks that can be executed using `npm` or `yarn`.

- `dev`: `vite`
  - Starts the Vite development server, enabling hot-reloading and a local development environment.
- `build`: `vite build`
  - Compiles and bundles the project for production deployment using Vite.
- `preview`: `vite preview`
  - Serves the production build locally for previewing before deployment.

## Dependencies

These are the packages required for the project to run.

### Runtime Dependencies

- `@google/genai` (`^1.0.0`): The official Google Generative AI SDK, used for interacting with AI models like Gemini.
- `lit` (`^3.3.0`): A simple library for building fast, lightweight web components. It's the foundation for the project's UI components.

### Development Dependencies (`devDependencies`)

These packages are necessary for development and building but are not included in the production build.

- `@types/node` (`^22.14.0`): TypeScript type definitions for Node.js, providing type safety for Node.js APIs.
- `typescript` (`~5.8.2`): The TypeScript compiler, used to transpile TypeScript code into JavaScript.
- `vite` (`^6.2.0`): A modern frontend build tool that significantly improves the development experience, offering fast cold server starts and instant Hot Module Replacement (HMR).