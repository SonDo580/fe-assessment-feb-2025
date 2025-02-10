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
