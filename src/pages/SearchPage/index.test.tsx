import { render, screen } from "@testing-library/react";

import SearchPage from ".";

const BANNER_TEST_ID = "Banner";
const RESULTS_TEST_ID = "Results";
const SEARCH_TEST_ID = "Search";

describe("SearchPage component", () => {
  beforeAll(() => {
    vi.mock("./components/Banner", () => ({
      default: () => <div data-testid={BANNER_TEST_ID} />,
    }));

    vi.mock("./components/Results", () => ({
      default: () => <div data-testid={RESULTS_TEST_ID} />,
    }));

    vi.mock("./components/Search", () => ({
      default: () => <div data-testid={SEARCH_TEST_ID} />,
    }));
  });

  afterAll(() => {
    vi.resetModules();
  });

  it("should render Banner, Search, Results component", () => {
    render(<SearchPage />);
    expect(screen.getByTestId(BANNER_TEST_ID)).toBeInTheDocument();
    expect(screen.getByTestId(RESULTS_TEST_ID)).toBeInTheDocument();
    expect(screen.getByTestId(SEARCH_TEST_ID)).toBeInTheDocument();
  });
});
