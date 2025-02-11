/* Search results */
export type THighlightOffset = {
  BeginOffset: number;
  EndOffset: number;
};

type TDocumentTitle = {
  Text: string;
  Highlights: THighlightOffset[];
};

type TDocumentExcerpt = {
  Text: string;
  Highlights: THighlightOffset[];
};

export type TResultItem = {
  DocumentId: string;
  DocumentTitle: TDocumentTitle;
  DocumentExcerpt: TDocumentExcerpt;
  DocumentURI: string;
};

export type TSeachResults = {
  TotalNumberOfResults: number;
  Page: number;
  PageSize: number;
  ResultItems: TResultItem[];
};

/* Suggestions */
export type TSuggestionResults = {
  stemmedQueryTerm: string;
  suggestions: string[];
};

/* Other */
export type TTextSegment = { text: string; shouldHighlight: boolean };
