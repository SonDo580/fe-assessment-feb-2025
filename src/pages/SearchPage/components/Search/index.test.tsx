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
    const BTN_LABEL_TEXT = "search-btn";

    it("blur input and update search params when input is not empty", async () => {
      render(<Search />);

      const searchButton = screen.getByLabelText(BTN_LABEL_TEXT);
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

  describe("Search component - clear button behavior", () => {
    const BTN_LABEL_TEXT = "clear-btn";

    it("render and clear input when clicked if input is focused and has value", async () => {
      render(<Search />);

      const input = screen.getByRole("textbox");

      // Clear button should not be rendered initially
      let clearButton = screen.queryByLabelText(BTN_LABEL_TEXT);
      expect(clearButton).toBeNull();

      // Focus on input but leave it empty
      // -> clear should still not be rendered
      await userEvent.click(input);
      clearButton = screen.queryByLabelText(BTN_LABEL_TEXT);
      expect(clearButton).toBeNull();

      // Type text into input
      // -> clear button should appear
      const inputValue = "test";
      await userEvent.type(input, inputValue);
      clearButton = screen.getByLabelText(BTN_LABEL_TEXT);

      // Blur input (value remains)
      // -> clear button should disappear
      await userEvent.tab();
      clearButton = screen.queryByLabelText(BTN_LABEL_TEXT);
      expect(clearButton).toBeNull();

      // Focus on input again
      // -> clear button should re-appear
      await userEvent.click(input);
      clearButton = screen.getByLabelText(BTN_LABEL_TEXT);

      // Click clear button
      // -> The input should be cleared but still focused
      await userEvent.click(clearButton);
      expect(input).toHaveValue("");
      expect(input).toHaveFocus();
    });
  });
});
