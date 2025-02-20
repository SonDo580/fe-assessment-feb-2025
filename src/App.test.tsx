import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";

const SEARCH_PAGE_TEST_ID = "SearchPage";

vi.mock("./pages/SearchPage", () => ({
  default: () => <div data-testid={SEARCH_PAGE_TEST_ID} />,
}));

describe("App component", () => {
  test("render SearchPage at root path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId(SEARCH_PAGE_TEST_ID)).toBeInTheDocument();
  });
});
