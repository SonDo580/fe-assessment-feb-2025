import classNames from "classnames";
import { twMerge } from "tailwind-merge";

import { TSuggestionResults } from "@/types";
import { NUMBER_OF_SUGGESTIONS_TO_DISPLAY } from "@/constants";
import HighlightText from "@/components/ui/HighlightText";
import { produceSuggestionTextSegments } from "@/utils/produce-text-segments";

export interface IProps {
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
  const wrapperClassNames = classNames(
    className,
    "rounded-b-md shadow-common bg-white p-4"
  );

  if (loading) {
    return <div className={wrapperClassNames}>Loading...</div>;
  }

  if (errorMsg) {
    return (
      <div className={classNames(wrapperClassNames, "text-red-700")}>
        {errorMsg}
      </div>
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
      <div className={wrapperClassNames}>
        No suggestions found for{" "}
        <span className="font-bold">{stemmedQueryTerm}</span>
      </div>
    );
  }

  return (
    <div className={twMerge(wrapperClassNames, "p-0")}>
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
    </div>
  );
}

export default SuggestionDropdown;
