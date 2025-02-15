import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, milliseconds: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, milliseconds);

    return () => {
      // Reset if value changes before delay
      clearTimeout(timeoutId);
    };
  }, [value, milliseconds]);

  return debouncedValue;
}
