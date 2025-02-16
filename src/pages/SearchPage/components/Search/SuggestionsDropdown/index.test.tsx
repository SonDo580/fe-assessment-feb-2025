import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SuggestionDropdown, { IProps } from ".";
import { TSuggestionResults, TTextSegment } from "@/types";
import { NUMBER_OF_SUGGESTIONS_TO_DISPLAY } from "@/constants";

// Mock HighlightText component (just concatenate the text segments)
vi.mock("@/components/ui/HighlightText", () => ({
  default: ({ textSegments }: { textSegments: TTextSegment[] }) => (
    <span>{textSegments.map(({ text }) => text).join("")}</span>
  ),
}));

// Helper to generate suggestions from queryTerm
const generateSuggestions = (queryTerm: string, length: number): string[] => {
  const suggestions: string[] = [];
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  for (let i = 0; i < length; i++) {
    const prefix =
      Math.random() < 0.5
        ? queryTerm.charAt(0).toUpperCase() + queryTerm.slice(1)
        : queryTerm.charAt(0).toLowerCase() + queryTerm.slice(1);
    const suffix = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    suggestions.push(prefix + suffix);
  }

  return suggestions;
};

const mockOnSelect = vi.fn();
const baseProps: IProps = {
  className: "",
  onSelect: mockOnSelect,
  activeIndex: -1,
  loading: false,
  errorMsg: "",
  data: null,
};

describe("SuggestionsDropdown component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("render loading state", () => {
    render(<SuggestionDropdown {...baseProps} loading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("render error state", () => {
    const errorMsg = "test";
    render(<SuggestionDropdown {...baseProps} errorMsg={errorMsg} />);
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it("render no-data", () => {
    const mockData: TSuggestionResults = {
      stemmedQueryTerm: "test",
      suggestions: [],
    };

    render(<SuggestionDropdown {...baseProps} data={mockData} />);

    expect(screen.getByText(/No suggestions found/i)).toBeInTheDocument();
    expect(screen.getByText(mockData.stemmedQueryTerm)).toBeInTheDocument();
  });

  it("render suggestions correctly", () => {
    const mockData: TSuggestionResults = {
      stemmedQueryTerm: "React",
      suggestions: ["reaction", "React Native"],
    };

    render(<SuggestionDropdown {...baseProps} data={mockData} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(mockData.suggestions.length);

    for (let i = 0; i < listItems.length; i++) {
      expect(listItems[i]).toHaveTextContent(mockData.suggestions[i]);
    }
  });

  it("should slice suggestions if exceed limit", () => {
    const stemmedQueryTerm = "React";
    const mockData: TSuggestionResults = {
      stemmedQueryTerm,
      suggestions: generateSuggestions(
        stemmedQueryTerm,
        NUMBER_OF_SUGGESTIONS_TO_DISPLAY + 1 // exceed limit
      ),
    };

    render(<SuggestionDropdown {...baseProps} data={mockData} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(NUMBER_OF_SUGGESTIONS_TO_DISPLAY);

    for (let i = 0; i < listItems.length; i++) {
      expect(listItems[i]).toHaveTextContent(mockData.suggestions[i]);
    }
  });

  it("should highlight the only active suggestion", () => {
    const activeIndex = 1;
    const mockData: TSuggestionResults = {
      stemmedQueryTerm: "React",
      suggestions: ["reaction", "React Native", "reactive"],
    };

    render(
      <SuggestionDropdown
        {...baseProps}
        data={mockData}
        activeIndex={activeIndex}
      />
    );

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(mockData.suggestions.length);

    for (let i = 0; i < listItems.length; i++) {
      expect(listItems[i]).toHaveTextContent(mockData.suggestions[i]);

      // Check highlighting
      const activeClassName = "bg-slate-100";
      if (i === activeIndex) {
        expect(listItems[i]).toHaveClass(activeClassName);
      } else {
        expect(listItems[i]).not.toHaveClass(activeClassName);
      }
    }
  });

  it("should call onSelect when a suggestion is clicked", async () => {
    const mockData: TSuggestionResults = {
      stemmedQueryTerm: "React",
      suggestions: ["reaction", "React Native"],
    };

    render(<SuggestionDropdown {...baseProps} data={mockData} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(mockData.suggestions.length);

    const indexToSelect = 0;
    await userEvent.click(listItems[indexToSelect]);

    expect(mockOnSelect).toHaveBeenCalledOnce()
    expect(mockOnSelect).toHaveBeenCalledWith(
      mockData.suggestions[indexToSelect]
    );
  });
});
