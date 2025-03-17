import { THighlightOffset, TResultItem, TSearchResults } from "@/types";

/**
 * OPTIONAL:
 * Functions to transform result on the FE side when using fixed data
 * - transformSearchResults
 * - transformSuggestions 
 */

export function transformSearchResults(
  data: TSearchResults,
  keyword: string
): TSearchResults {
  const lowerKeyword = keyword.toLowerCase();
  const { Page, PageSize, TotalNumberOfResults, ResultItems } = data;

  // - Keep Page and PageSize intact as they represent search parameters
  // - For ResultItems
  //   + Keep the ones where keyword appears in Text or Excerpt
  //   + Update the Highlights array
  // - Update TotalNumberOfResults
  //   + let n = number of filtered items
  //   + if n matches PageSize, we can keep TotalNumberOfResults
  //   + if n < PageSize, we should use n for TotalNumberOfResults 

  const generateHighlights = (text: string): THighlightOffset[] => {
    const highlights: THighlightOffset[] = [];
    const lowerText = text.toLowerCase();
    let offset = 0;

    while (true) {
      const index = lowerText.indexOf(lowerKeyword, offset);
      if (index === -1) {
        break;
      }

      highlights.push({
        BeginOffset: index,
        EndOffset: index + keyword.length,
      });

      offset = index + 1; // move past current match (allow overlap)
    }

    return highlights;
  };

  const mapFn = (item: TResultItem) => {
    const titleHighlights = generateHighlights(item.DocumentTitle.Text);
    const excerptHighlights = generateHighlights(item.DocumentExcerpt.Text);

    return {
      ...item,
      DocumentTitle: {
        ...item.DocumentTitle,
        Highlights: titleHighlights,
      },
      DocumentExcerpt: {
        ...item.DocumentExcerpt,
        Highlights: excerptHighlights,
      },
    };
  };

  const filterFn = (item: TResultItem) =>
    item.DocumentTitle.Highlights.length > 0 ||
    item.DocumentExcerpt.Highlights.length > 0;

  const filteredItems = ResultItems.map(mapFn).filter(filterFn);
  const total =
    filteredItems.length === PageSize
      ? TotalNumberOfResults
      : filteredItems.length;

  return {
    Page,
    PageSize,
    ResultItems: filteredItems,
    TotalNumberOfResults: total,
  };
}
