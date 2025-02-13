import classNames from "classnames";

import HighlightText from "@/components/ui/HighlightText";
import { produceSuggestionTextSegments } from "@/utils/produce-text-segments";
import { TSuggestionResults } from "@/types";
import { NUMBER_OF_SUGGESTIONS_TO_DISPLAY } from "@/constants";
import SuggestionsWrapper from "../SuggestionsWrapper";

interface IProps {
  className: string;
  onSelect: (suggestion: string) => void;
  activeIndex: number;
  loading: boolean;
  errorMsg: string;
  data: TSuggestionResults | null;
}

function SuggestionDropdown({
  activeIndex,
  className,
  onSelect,
  loading,
  errorMsg,
  data,
}: IProps) {
  if (loading) {
    return (
      <SuggestionsWrapper className={className}>
        <div>Loading...</div>
      </SuggestionsWrapper>
    );
  }

  if (errorMsg) {
    return (
      <SuggestionsWrapper className={className}>
        <div className="text-red-700">{errorMsg}</div>
      </SuggestionsWrapper>
    );
  }

  if (!data) {
    return;
  }

  const { stemmedQueryTerm, suggestions } = data;
  const displayedSuggestions =
    suggestions.slice(0, NUMBER_OF_SUGGESTIONS_TO_DISPLAY) ?? [];

  if (displayedSuggestions.length === 0) {
    return (
      <SuggestionsWrapper className={className}>
        <div>No suggestions found</div>
      </SuggestionsWrapper>
    );
  }

  return (
    <SuggestionsWrapper className={className} noData={false}>
      <ul className="flex flex-col">
        {displayedSuggestions.map((suggestion, index) => (
          <li
            key={index}
            className={classNames(
              "px-6 py-3 hover:cursor-pointer hover:bg-slate-100",
              activeIndex === index && "bg-slate-100"
            )}
            onMouseDown={() => onSelect(suggestion)}
          >
            <HighlightText
              textSegments={produceSuggestionTextSegments(
                stemmedQueryTerm,
                suggestion
              )}
            />
          </li>
        ))}
      </ul>
    </SuggestionsWrapper>
  );
}

export default SuggestionDropdown;