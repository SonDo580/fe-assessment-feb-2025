import { render, screen } from "@testing-library/react";

import { TResultItem, TTextSegment } from "@/types";
import ResultItem from ".";

// Mock HighlightText component (just concatenate the text segments)
vi.mock("@/components/ui/HighlightText", () => ({
  default: ({ textSegments }: { textSegments: TTextSegment[] }) => (
    <span>{textSegments.map(({ text }) => text).join("")}</span>
  ),
}));

describe("ResultItem component", () => {
  it("renders title, excerpt, links correctly", () => {
    const item: TResultItem = {
      DocumentId: "123",
      DocumentTitle: {
        Text: "Web Browser",
        Highlights: [{ BeginOffset: 0, EndOffset: 3 }],
      },
      DocumentExcerpt: {
        Text: "...A web browser is an application for accessing websites...",
        Highlights: [{ BeginOffset: 4, EndOffset: 7 }],
      },
      DocumentURI: "https://example.com",
    };

    render(<ResultItem item={item} />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBe(2);

    expect(links[0]).toHaveAttribute("href", item.DocumentURI);
    expect(links[0]).toHaveTextContent(item.DocumentTitle.Text);

    expect(links[1]).toHaveAttribute("href", item.DocumentURI);
    expect(links[1]).toHaveTextContent(item.DocumentURI);

    expect(screen.getByText(item.DocumentExcerpt.Text)).toBeInTheDocument();
  });
});
