import classNames from "classnames";

import suggestionResults from "@/mock/suggestions.json";
import HighlightText from "@/components/ui/HighlightText";
import { produceSuggestionTextSegments } from "@/utils/produce-text-segments";

interface IProps {
  className: string;
}

function SuggestionDropdown({ className }: IProps) {
  const { stemmedQueryTerm, suggestions } = suggestionResults;

  return (
    <div
      className={classNames(
        className,
        "p-2 rounded-b-md shadow-common bg-white flex flex-col"
      )}
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="px-6 py-3 hover:cursor-pointer hover:bg-slate-100"
        >
          <HighlightText
            textSegments={produceSuggestionTextSegments(
              stemmedQueryTerm,
              suggestion
            )}
          />
        </div>
      ))}
    </div>
  );
}

export default SuggestionDropdown;
