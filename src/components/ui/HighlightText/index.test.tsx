import { render, screen } from "@testing-library/react";

import { TTextSegment } from "@/types";
import HighlightText from ".";

describe("HighlightText component", () => {
  it("render text segments correctly", () => {
    const textSegments: TTextSegment[] = [
      {
        text: "Good ",
        shouldHighlight: false,
      },
      {
        text: "morning",
        shouldHighlight: true,
      },
    ];

    render(<HighlightText textSegments={textSegments} />);

    textSegments.forEach(({ text, shouldHighlight }) => {
      const regex = new RegExp(text.trim(), "i");
      const element = screen.getByText(regex);
      expect(element).toBeInTheDocument();

      const boldClassName = "font-bold";
      if (shouldHighlight) {
        expect(element).toHaveClass(boldClassName);
      } else {
        expect(element).not.toHaveClass(boldClassName);
      }
    });
  });

  it("render no content with empty text segments", () => {
    const { container } = render(<HighlightText textSegments={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
