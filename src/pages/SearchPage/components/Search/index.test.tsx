import { useSearchParams } from "react-router-dom";
import { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useQuery } from "@/hooks/useQuery";
import { TSuggestionResults } from "@/types";
import Search from ".";
import { MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS } from "@/constants";

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

// Helper to generate random text with certain length
const generateRandomText = (length: number) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return text;
};

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
      // -> clear button should still not be rendered
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
      // -> input should be cleared but still focused
      await userEvent.click(clearButton);
      expect(input).toHaveValue("");
      expect(input).toHaveFocus();
    });
  });

  describe("Search component - suggestions dropdown behavior", () => {
    it("only render when input is focused and value is long enough", async () => {
      render(<Search />);

      const input = screen.getByRole("textbox");

      // Dropdown should not be rendered initially
      let dropdown = screen.queryByTestId(SUGGESTION_DROPDOWN_TEST_ID);
      expect(dropdown).toBeNull();

      // Focus on input but leave it empty
      // -> dropdown should still not be rendered
      await userEvent.click(input);
      dropdown = screen.queryByTestId(SUGGESTION_DROPDOWN_TEST_ID);
      expect(dropdown).toBeNull();

      // Type text into input but not enough length
      // -> dropdown should still not be rendered
      const inputValue = generateRandomText(
        MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS - 1
      );
      await userEvent.type(input, inputValue);
      dropdown = screen.queryByTestId(SUGGESTION_DROPDOWN_TEST_ID);
      expect(dropdown).toBeNull();

      // The input value becomes long enough
      // -> dropdown should appear
      await userEvent.type(input, "a");
      dropdown = screen.getByTestId(SUGGESTION_DROPDOWN_TEST_ID);

      // Blur input (value remains)
      // -> dropdown should disappear
      await userEvent.tab();
      dropdown = screen.queryByTestId(SUGGESTION_DROPDOWN_TEST_ID);
      expect(dropdown).toBeNull();

      // Focus on input again
      // -> dropdown should re-appear
      await userEvent.click(input);
      dropdown = screen.getByTestId(SUGGESTION_DROPDOWN_TEST_ID);
    });
  });
});
