import { useSearchParams } from "react-router-dom";
import { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useQuery } from "@/hooks/useQuery";
import { TSuggestionResults } from "@/types";
import Search from ".";

const SUGGESTION_DROPDOWN_TEST_ID = "SuggestionsDropdown";

vi.mock("./SuggestionsDropdown", () => ({
  default: () => <div data-testid={SUGGESTION_DROPDOWN_TEST_ID} />,
}));

vi.mock("react-router-dom", () => ({
  useSearchParams: vi.fn(),
}));
const mockUseSearchParams = useSearchParams as Mock;
const mockSetSearchParams = vi.fn();
const mockUseSearchParamsReturnValue = [
  new URLSearchParams(""),
  mockSetSearchParams,
]; // default

vi.mock("@/hooks/useQuery", () => ({
  useQuery: vi.fn(),
}));
const mockUseQuery = useQuery as Mock;
type UseQueryReturnType = ReturnType<typeof useQuery<TSuggestionResults>>;
const mockUseQueryReturnValue: UseQueryReturnType = {
  loading: false,
  errorMsg: "",
  data: null,
}; // default

describe("Search component", () => {
  let blurSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    blurSpy = vi.spyOn(HTMLInputElement.prototype, "blur");
    mockUseSearchParams.mockReturnValue(mockUseSearchParamsReturnValue);
    mockUseQuery.mockReturnValue(mockUseQueryReturnValue);
  });

  afterEach(() => {
    blurSpy.mockRestore();
    vi.resetAllMocks();
  });

  describe("Search component - search button behavior", () => {
    it("should blur input and update search params if input is not empty when clicked", async () => {
      render(<Search />);

      const searchButton = screen.getByLabelText("search-btn");
      await userEvent.click(searchButton);

      expect(blurSpy).toHaveBeenCalledOnce();
      expect(mockSetSearchParams).not.toHaveBeenCalled();

      // Add input value and check again
      const inputValue = "test";
      const input = screen.getByRole("textbox");
      await userEvent.type(input, inputValue);

      await userEvent.click(searchButton);

      expect(blurSpy).toHaveBeenCalledTimes(2);
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        new URLSearchParams(`q=${inputValue}`)
      );
    });
  });
});
