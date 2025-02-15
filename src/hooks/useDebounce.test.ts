import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce hook", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Mocker timer to control delays
  });

  afterEach(() => {
    vi.useRealTimers(); // Restore timer
  });

  it("should return initial value immediately", () => {
    const value = "hello";
    const delay = 500;

    const { result } = renderHook(() => useDebounce(value, delay));
    expect(result.current).toBe(value);
  });

  it("should update debounced value after delay", () => {
    const initialValue = "hello";
    const updatedValue = "world";
    const delay = 500;

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, delay),
      {
        initialProps: { value: initialValue },
      }
    );

    // Initial debounced value should be {initialValue}
    expect(result.current).toBe(initialValue);

    // Update value prop
    // Debounced value should not update immediately
    rerender({ value: updatedValue });
    expect(result.current).toBe(initialValue);

    // Fast-forward the time by {delay - 100}ms
    // Debounced value should not update yet
    act(() => {
      vi.advanceTimersByTime(delay - 100);
    });
    expect(result.current).toBe(initialValue);

    // Fast-forward the time by 100ms (total {delay}ms)
    // Debounced value should update
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(updatedValue);
  });

  it("should return the latest debounced value after multiple updates", () => {
    const initialValue = "hello";
    const nextValue1 = "world";
    const nextValue2 = "my friend";
    const delay = 500;

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, delay),
      {
        initialProps: { value: initialValue },
      }
    );

    // Initial debounced value should be {initialValue}
    expect(result.current).toBe(initialValue);

    // Update value prop with {nextValue1}
    // Debounced value should not update immediately
    rerender({ value: nextValue1 });
    expect(result.current).toBe(initialValue);

    // Fast-forward the time by {delay - 100}ms
    // Debounced value should not update yet
    act(() => {
      vi.advanceTimersByTime(delay - 100);
    });
    expect(result.current).toBe(initialValue);

    // Update value prop with {nextValue2}
    // The timer is reset
    // Debounced value should not update yet
    rerender({ value: nextValue2 });
    expect(result.current).toBe(initialValue);

    // Fast-forward the time by 100ms
    // Debounced value should not update yet (because the timer has been reset)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(initialValue);

    // Fast-forward the time by {delay - 100}ms (total {delay}ms)
    // Debounced value should update to {nextValue2}
    act(() => {
      vi.advanceTimersByTime(delay - 100);
    });
    expect(result.current).toBe(nextValue2);
  });
});
