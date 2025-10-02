The `utils/throttle.ts` file exports a utility function named `throttle`. This function is designed to limit the execution rate of another function, ensuring it's called at most once within a specified time interval.

**Purpose:**
Throttling is crucial for optimizing performance, particularly for event handlers that can trigger frequently (e.g., `scroll`, `resize`, `mousemove`). By applying `throttle`, you prevent excessive function calls, thereby reducing unnecessary computations and improving application responsiveness.

**How it works:**
The `throttle` function takes the target function (`func`) and a `delay` (in milliseconds) as arguments. It returns a new function that wraps `func`. This wrapper function internally tracks the timestamp of the last successful execution.

When the throttled function is invoked:

1.  It calculates the time elapsed since the last execution.
2.  If the elapsed time is greater than or equal to the specified `delay`, it executes the original `func` with the provided arguments, updates the `lastCall` timestamp, and stores the return value of `func` in `lastResult`.
3.  If the elapsed time is less than the `delay`, the function call is ignored, and the previously stored `lastResult` is returned.

This mechanism ensures that `func` is executed at most once within the `delay` period. The function also returns the result of the last successful execution, providing a way to access the most recent computed value even when a call is throttled.

**Example Usage:**

```typescript
function handleScroll(event: Event) {
  console.log('Scrolled!', Date.now());
}

// Throttle the scroll handler to be called at most once every 200ms
const throttledScrollHandler = throttle(handleScroll, 200);

window.addEventListener('scroll', throttledScrollHandler);
```

In this example, `handleScroll` will only be executed at most once every 200 milliseconds, even if the scroll event fires more frequently. The `throttledScrollHandler` will return the result of the last `handleScroll` execution.

**Note on Return Value:** If the throttled function is called before the delay has passed since the last execution, the previously returned `lastResult` is returned. If this is the very first call and the delay hasn't passed, `lastResult` might be undefined, depending on the return type of the original function and TypeScript's inference.