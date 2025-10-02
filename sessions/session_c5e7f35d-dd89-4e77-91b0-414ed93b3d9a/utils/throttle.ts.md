The `utils/throttle.ts` file exports a single utility function, `throttle`. This function is designed to limit the rate at which another function can be called. It takes two arguments: the function to throttle (`func`) and the minimum delay in milliseconds (`delay`) between calls.

**Purpose:**
Throttling is useful for performance optimization, especially for event handlers that might fire rapidly (e.g., scroll, resize, or input events). By throttling such functions, you ensure they are executed at most once within the specified delay, preventing excessive computations or UI updates.

**How it works:**
The `throttle` function returns a new function that wraps the original `func`. This new function keeps track of the last time `func` was called. When the throttled function is invoked, it checks if enough time has passed since the last execution (i.e., if `Date.now() - lastCall >= delay`).

- If the delay has passed, it executes the original `func` with the provided arguments, updates `lastCall` to the current time, and stores the result of `func`.
- If the delay has not passed, it does nothing but returns the `lastResult` from the previous successful execution.

This ensures that `func` is called at most once per `delay` interval, while still returning the most recent valid result.