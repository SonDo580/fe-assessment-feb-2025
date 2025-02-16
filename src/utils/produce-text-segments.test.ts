import { THighlightOffset, TTextSegment } from "@/types";
import {
  produceDocumentTextSegments,
  produceSuggestionTextSegments,
} from "./produce-text-segments";

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

    expect(result).toStrictEqual(expectedResult);
  });

  it("should split text into normal and highlighted segments", () => {
    const text = "Hello world. This is a test!";
    const highlights: THighlightOffset[] = [
      {
        BeginOffset: 6,
        EndOffset: 11,
      },
      {
        BeginOffset: 18,
        EndOffset: 20,
      },
    ];

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

    expect(result).toStrictEqual(expectedResult);
  });
});

describe("Test produceSuggestionTextSegments", () => {
  it("should return full normal text if there are no matches", () => {
    const queryTerm = "child";
    const suggestion = "I'm an adult";

    const result = produceSuggestionTextSegments(queryTerm, suggestion);
    const expectedResult: TTextSegment[] = [
      {
        text: suggestion,
        shouldHighlight: false,
      },
    ];

    expect(result).toStrictEqual(expectedResult);
  });

  it("should split text into normal and highlighted segments", () => {
    const queryTerm = "cat";
    const suggestion = "The Cat is catching a mouse";

    const result = produceSuggestionTextSegments(queryTerm, suggestion);
    const expectedResult: TTextSegment[] = [
      {
        text: "The ",
        shouldHighlight: false,
      },
      {
        text: "Cat",
        shouldHighlight: true,
      },
      {
        text: " is ",
        shouldHighlight: false,
      },
      {
        text: "cat",
        shouldHighlight: true,
      },
      {
        text: "ching a mouse",
        shouldHighlight: false,
      },
    ];

    expect(result).toStrictEqual(expectedResult);
  });
});
