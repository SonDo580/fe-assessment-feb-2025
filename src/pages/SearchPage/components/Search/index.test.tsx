import { useSearchParams } from "react-router-dom";
import { Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useQuery } from "@/hooks/useQuery";
import { TSuggestionResults } from "@/types";
import { KeyboardKeys, MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS } from "@/constants";
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

vi.mock("@/hooks/useQuery", () => ({
  useQuery: vi.fn(),
}));
const mockUseQuery = useQuery as Mock;
type UseQueryReturnType = ReturnType<typeof useQuery<TSuggestionResults>>;

// Default mock return values
const mockUseSearchParamsReturnValue = [
  new URLSearchParams(""),
  mockSetSearchParams,
];
const mockUseQueryReturnValue: UseQueryReturnType = {
  loading: false,
  errorMsg: "",
  data: null,
};

// Helper to generate random text with certain length
const generateRandomText = (length: number): string => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return text;
};

// Helper to wrap the key in {} to use in userEvents.keyboard
const getWrappedKeyboardKey = (key: KeyboardKeys): string => `{${key}}`;

// Helper to generate URLSeachParams (for only keyword)
const getURLSeachParams = (keyword: string): URLSearchParams =>
  new URLSearchParams(`q=${keyword}`);

const WrappedKeys = {
  ENTER: getWrappedKeyboardKey(KeyboardKeys.ENTER),
  ARROW_UP: getWrappedKeyboardKey(KeyboardKeys.ARROW_UP),
  ARROW_DOWN: getWrappedKeyboardKey(KeyboardKeys.ARROW_DOWN),
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

  describe("Search component - input behavior", () => {
    it("should be empty initially if search param have no value", () => {
      render(<Search />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");
    });

    it("should populate with value from search param initially", () => {
      const keyword = "test";
      mockUseSearchParams.mockReturnValue([
        new URLSearchParams(`q=${keyword}`),
        mockSetSearchParams,
      ]);

      render(<Search />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue(keyword);
    });

    it("should update input value when typing", async () => {
      render(<Search />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");

      const inputValue = "test";
      await userEvent.type(input, "test");
      expect(input).toHaveValue(inputValue);
    });

    it("should handle keyboard events correctly", async () => {
      const mockSuggestions: string[] = ["zero", "zebra", "zet"];
      const mockUseQueryReturnValue: UseQueryReturnType = {
        loading: false,
        errorMsg: "",
        data: {
          stemmedQueryTerm: "ze",
          suggestions: mockSuggestions,
        },
      };
      mockUseQuery.mockReturnValue(mockUseQueryReturnValue);

      render(<Search />);
      const input = screen.getByRole("textbox");
      const inputValue = generateRandomText(MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS);
      await userEvent.type(input, inputValue);

      // Press Enter 
      // -> + trigger search param update 
      //    + input lose focus
      await userEvent.keyboard(WrappedKeys.ENTER);
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        getURLSeachParams(inputValue)
      );
      await waitFor(() => expect(input).not.toHaveFocus());

      // Focus on input again and press ArrowUp once
      // -> activeSuggestionIndex changes from -1 to 2
      await userEvent.click(input);
      await userEvent.keyboard(WrappedKeys.ARROW_UP);

      // Press Enter
      // -> + trigger search param update
      //    + input value update & input lose focus
      await userEvent.keyboard(WrappedKeys.ENTER);
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        getURLSeachParams(mockSuggestions[2])
      );
      expect(input).toHaveValue(mockSuggestions[2]);
      await waitFor(() => expect(input).not.toHaveFocus());

      // Focus on input again and press ArrowDown 2 times
      // -> activeSuggestionIndex changes from 2 to -1 to 0
      await userEvent.click(input);
      await userEvent.keyboard(WrappedKeys.ARROW_DOWN);
      await userEvent.keyboard(WrappedKeys.ARROW_DOWN);

      // Press Enter
      // -> + trigger search param update
      //    + input value update & input lose focus
      await userEvent.keyboard(WrappedKeys.ENTER);
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        getURLSeachParams(mockSuggestions[0])
      );
      expect(input).toHaveValue(mockSuggestions[0]);
      await waitFor(() => expect(input).not.toHaveFocus());
    });
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

      // Click search button again
      // -> trigger search param update & input lose focus
      await userEvent.click(searchButton);
      expect(blurSpy).toHaveBeenCalledTimes(2);
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        getURLSeachParams(inputValue)
      );
      expect(input).not.toHaveFocus();
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
