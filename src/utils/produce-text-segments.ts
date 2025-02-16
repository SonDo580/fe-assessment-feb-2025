import { THighlightOffset, TTextSegment } from "@/types";

export const produceDocumentTextSegments = (
  text: string,
  highlights: THighlightOffset[]
): TTextSegment[] => {
  let current = 0;
  const segments: TTextSegment[] = [];

  highlights.forEach(({ BeginOffset, EndOffset }) => {
    // Add normal text
    if (BeginOffset > current) {
      segments.push({
        text: text.slice(current, BeginOffset),
        shouldHighlight: false,
      });
    }

    // Add highlighted text
    segments.push({
      text: text.slice(BeginOffset, EndOffset),
      shouldHighlight: true,
    });

    current = EndOffset;
  });

  // Add the remaining normal segment
  if (current < text.length) {
    segments.push({ text: text.slice(current), shouldHighlight: false });
  }

  return segments;
};

export const produceSuggestionTextSegments = (
  queryTerm: string,
  suggestion: string
): TTextSegment[] => {
  const queryLower = queryTerm.toLowerCase();
  const suggestionLower = suggestion.toLowerCase();
  const segments: TTextSegment[] = [];
  let startIndex = 0;

  while (startIndex < suggestion.length) {
    const matchIndex = suggestionLower.indexOf(queryLower, startIndex);

    // There's no match
    if (matchIndex === -1) {
      break;
    }

    // Add a normal text segment and a highlighted text segment
    segments.push(
      {
        text: suggestion.slice(startIndex, matchIndex),
        shouldHighlight: false,
      },
      {
        text: suggestion.slice(matchIndex, matchIndex + queryTerm.length),
        shouldHighlight: true,
      }
    );

    // Continue with the remaining suggestion text
    startIndex = matchIndex + queryTerm.length;
  }

  // Add the remaining normal segment
  if (startIndex < suggestion.length) {
    segments.push({
      text: suggestion.slice(startIndex),
      shouldHighlight: false,
    });
  }

  return segments;
};
