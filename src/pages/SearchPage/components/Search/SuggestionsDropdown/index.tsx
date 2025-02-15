import classNames from "classnames";

import { TSuggestionResults } from "@/types";
import { NUMBER_OF_SUGGESTIONS_TO_DISPLAY } from "@/constants";
import SuggestionItem from "../SuggestionItem";

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
  const wrapperClassNames = classNames(
    className,
    "rounded-b-md shadow-common bg-white"
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
    <div className={classNames(wrapperClassNames, "p-4")}>
      <ul className="flex flex-col">
        {displayedSuggestions.map((suggestion, index) => (
          <SuggestionItem
            key={index}
            active={activeIndex === index}
            suggestion={suggestion}
            queryTerm={stemmedQueryTerm}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  );
}

export default SuggestionDropdown;
