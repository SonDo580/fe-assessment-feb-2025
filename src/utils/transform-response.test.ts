import { TSearchResults, TSuggestionResults } from "@/types";
import {
  transformSearchResults,
  transformSuggestionResults,
} from "./transform-response";

describe("Test transformSearchResults", () => {
  it("should return empty result if there are no matches", () => {
    const keyword = "child";
    const data: TSearchResults = {
      Page: 1,
      PageSize: 10,
      TotalNumberOfResults: 100,
      ResultItems: [
        {
          DocumentId: "1",
          DocumentTitle: { Text: "Hello world", Highlights: [] },
          DocumentExcerpt: { Text: "Tom and Jerry", Highlights: [] },
          DocumentURI: "http://example.com/1",
        },
      ],
    };

    const result = transformSearchResults(data, keyword);
    const expectedResult: TSearchResults = {
      Page: data.Page, // Preserved
      PageSize: data.PageSize, // Preserved
      TotalNumberOfResults: 0, // No matches
      ResultItems: [], // No matches
    };

    expect(result).toStrictEqual(expectedResult);
  });

  it("should keep items containing keyword and update highlights", () => {
    const keyword = "we";
    const data: TSearchResults = {
      Page: 1,
      PageSize: 2,
      TotalNumberOfResults: 100,
      ResultItems: [
        {
          DocumentId: "1",
          DocumentTitle: { Text: "A wedding", Highlights: [] },
          DocumentExcerpt: { Text: "Text", Highlights: [] },
          DocumentURI: "http://example.com/1",
        },
        {
          DocumentId: "2",
          DocumentTitle: { Text: "Title", Highlights: [] },
          DocumentExcerpt: { Text: "Text", Highlights: [] },
          DocumentURI: "http://example.com/2",
        },
      ],
    };

    const result = transformSearchResults(data, keyword);
    const expectedResult: TSearchResults = {
      Page: data.Page, // Preserved
      PageSize: data.PageSize, // Preserved
      TotalNumberOfResults: 1,
      ResultItems: [
        {
          DocumentId: "1",
          DocumentTitle: {
            Text: "A wedding",
            Highlights: [
              {
                BeginOffset: 2,
                EndOffset: 4,
              },
            ],
          },
          DocumentExcerpt: { Text: "Text", Highlights: [] },
          DocumentURI: "http://example.com/1",
        },
      ],
    };

    expect(result).toStrictEqual(expectedResult);
  });

  it("should preserve TotalNumberOfResults if match all items", () => {
    const keyword = "we";
    const data: TSearchResults = {
      Page: 1,
      PageSize: 2,
      TotalNumberOfResults: 100,
      ResultItems: [
        {
          DocumentId: "1",
          DocumentTitle: { Text: "A wedding", Highlights: [] },
          DocumentExcerpt: { Text: "Text", Highlights: [] },
          DocumentURI: "http://example.com/1",
        },
        {
          DocumentId: "2",
          DocumentTitle: { Text: "Title", Highlights: [] },
          DocumentExcerpt: { Text: "Wednesday", Highlights: [] },
          DocumentURI: "http://example.com/2",
        },
      ],
    };

    const result = transformSearchResults(data, keyword);
    const expectedResult: TSearchResults = {
      Page: data.Page, // Preserved
      PageSize: data.PageSize, // Preserved
      TotalNumberOfResults: data.TotalNumberOfResults,
      ResultItems: [
        {
          DocumentId: "1",
          DocumentTitle: {
            Text: "A wedding",
            Highlights: [
              {
                BeginOffset: 2,
                EndOffset: 4,
              },
            ],
          },
          DocumentExcerpt: { Text: "Text", Highlights: [] },
          DocumentURI: "http://example.com/1",
        },
        {
          DocumentId: "2",
          DocumentTitle: { Text: "Title", Highlights: [] },
          DocumentExcerpt: {
            Text: "Wednesday",
            Highlights: [
              {
                BeginOffset: 0,
                EndOffset: 2,
              },
            ],
          },
          DocumentURI: "http://example.com/2",
        },
      ],
    };

    expect(result).toStrictEqual(expectedResult);
  });
});

describe("Test transformSuggestionResults", () => {
  const fixedResult = {
    stemmedQueryTerm: "child",
    suggestions: [
      "child care",
      "child vaccination",
      "child health",
      "child education",
      "child development account",
      "register childcare",
    ],
  };

  it("should return empty result if there are no matches", () => {
    const keyword = "invisible";
    const result = transformSuggestionResults(fixedResult, keyword);

    const expectedResult: TSuggestionResults = {
      stemmedQueryTerm: keyword,
      suggestions: [],
    };

    expect(result).toStrictEqual(expectedResult);
  });

  it("should filter result correctly", () => {
    const keywordToExpectedSuggestions = {
      EdU: ["child education"],
      child: fixedResult.suggestions, // match all
    };

    for (const [keyword, suggestions] of Object.entries(
      keywordToExpectedSuggestions
    )) {
      const result = transformSuggestionResults(fixedResult, keyword);
      const expectedResult: TSuggestionResults = {
        stemmedQueryTerm: keyword,
        suggestions: suggestions,
      };

      expect(result).toStrictEqual(expectedResult);
    }
  });
});
