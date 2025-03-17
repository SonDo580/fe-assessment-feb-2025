import { TSearchResults } from "@/types";
import { transformSearchResults } from "./transform-response";

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
