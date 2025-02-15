import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Runs a clean after each test case:
// - Removes React components from the virtual DOM.
// - Cleans up side effects like timers, event listeners, and subscriptions,...
afterEach(() => {
  cleanup();
});
