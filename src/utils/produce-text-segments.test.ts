import { THighlightOffset, TTextSegment } from "@/types";
import { describe, it, expect } from "vitest";
import { produceDocumentTextSegments } from "./produce-text-segments";

describe("Test produceDocumentTextSegments", () => {
  it("should return full normal text if there are no highlights", () => {
    const text = "No highlight";
    const highlights: THighlightOffset[] = [];

    const result = produceDocumentTextSegments(text, highlights);

    const expectedResult: TTextSegment[] = [
      {
        text,
        shouldHighlight: false,
      },
    ];

    expect(result).toEqual(expectedResult);
  });

  it("should split text into normal and highlighted segments", () => {
    const text = "Hello world. This is a test!";
    const highlights: THighlightOffset[] = [{
        BeginOffset: 6,
        EndOffset: 11,
    }, {
        BeginOffset: 18,
        EndOffset: 20,
    }];

    const result = produceDocumentTextSegments(text, highlights);
    const expectedResult: TTextSegment[] = [
      {
        text: "Hello ",
        shouldHighlight: false,
      },
      {
        text: "world",
        shouldHighlight: true,
      },
      {
        text: ". This ",
        shouldHighlight: false,
      },
      {
        text: "is",
        shouldHighlight: true,
      },
      {
        text: " a test!",
        shouldHighlight: false,
      },
    ];

    expect(result).toEqual(expectedResult);
  })
});
