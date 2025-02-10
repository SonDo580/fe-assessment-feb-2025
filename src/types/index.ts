type THighlightOffset = {
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
