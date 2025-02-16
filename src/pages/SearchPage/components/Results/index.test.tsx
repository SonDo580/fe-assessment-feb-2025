import { useSearchParams } from "react-router-dom";
import { Mock } from "vitest";
import { render, screen } from "@testing-library/react";

import { useQuery } from "@/hooks/useQuery";
import Results from ".";
import { TSeachResults } from "@/types";

vi.mock("react-router-dom", () => ({
  useSearchParams: vi.fn(),
}));
const mockUseSearchParams = useSearchParams as Mock;

vi.mock("@/hooks/useQuery", () => ({
  useQuery: vi.fn(),
}));
const mockUseQuery = useQuery as Mock;

const RESULT_ITEM_TEST_ID = "ResultItem";
vi.mock("./ResultItem", () => ({
  default: () => <div data-testid={RESULT_ITEM_TEST_ID}></div>,
}));

describe("Results component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("render nothing when no keyword is provided", () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams("")]);
    mockUseQuery.mockReturnValue({
      loading: false,
      errorMsg: "",
      data: null,
    });

    const { container } = render(<Results />);
    expect(container.firstChild).toBeNull();
  });

  it("render loading state", () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams("q=test")]);
    mockUseQuery.mockReturnValue({
      loading: true,
      errorMsg: "",
      data: null,
    });

    render(<Results />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("render error state", () => {
    const keyword = "test";
    const errorMsg = "test";

    mockUseSearchParams.mockReturnValue([new URLSearchParams(`q=${keyword}`)]);
    mockUseQuery.mockReturnValue({
      loading: false,
      errorMsg: errorMsg,
      data: null,
    });

    render(<Results />);

    const errorContainer = screen.getByText(errorMsg);
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveClass("text-red-700");
  });

  it("render no-data", () => {
    const keyword = "test";
    const mockData: TSeachResults = {
      TotalNumberOfResults: 0,
      Page: 1,
      PageSize: 10,
      ResultItems: [],
    };

    mockUseSearchParams.mockReturnValue([new URLSearchParams(`q=${keyword}`)]);
    mockUseQuery.mockReturnValue({
      loading: false,
      errorMsg: "",
      data: mockData,
    });

    render(<Results />);

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(keyword, "i"))).toBeInTheDocument();
  });

  it("render results correctly", () => {
    const keyword = "test";
    const mockData: TSeachResults = {
      TotalNumberOfResults: 2,
      Page: 1,
      PageSize: 10,
      ResultItems: [
        {
          DocumentId: "1",
          DocumentTitle: {
            Text: "Result 1",
            Highlights: [{ BeginOffset: 0, EndOffset: 6 }],
          },
          DocumentExcerpt: {
            Text: "Excerpt 1",
            Highlights: [{ BeginOffset: 0, EndOffset: 7 }],
          },
          DocumentURI: "",
        },
        {
          DocumentId: "2",
          DocumentTitle: {
            Text: "Result 2",
            Highlights: [{ BeginOffset: 0, EndOffset: 6 }],
          },
          DocumentExcerpt: {
            Text: "Excerpt 2",
            Highlights: [{ BeginOffset: 0, EndOffset: 7 }],
          },
          DocumentURI: "",
        },
      ],
    };

    mockUseSearchParams.mockReturnValue([new URLSearchParams(`q=${keyword}`)]);
    mockUseQuery.mockReturnValue({
      loading: false,
      errorMsg: "",
      data: mockData,
    });

    render(<Results />);

    expect(screen.getByText(/Showing 1-2 of 2 results/i)).toBeInTheDocument();

    const resultItems = screen.getAllByTestId(RESULT_ITEM_TEST_ID);
    expect(resultItems).toHaveLength(mockData.ResultItems.length);
  });
});
