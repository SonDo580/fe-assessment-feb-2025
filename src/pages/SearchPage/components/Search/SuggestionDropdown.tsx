import classNames from "classnames";

import HighlightText from "@/components/ui/HighlightText";
import { produceSuggestionTextSegments } from "@/utils/produce-text-segments";
import { suggestionEndpoint } from "@/services/api-endpoints";
import { useQuery } from "@/hooks/useQuery";
import { TSuggestionResults } from "@/types";

interface IProps {
  className: string;
  keyword: string;
  onSelect: (suggestion: string) => void;
}

function SuggestionDropdown({ keyword, className, onSelect }: IProps) {
  const { loading, data, errorMsg } = useQuery<TSuggestionResults>({
    url: keyword && `${suggestionEndpoint}?keyword=${keyword}`,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMsg) {
    return <div className="text-red-700">{errorMsg}</div>;
  }

  if (!data) {
    return;
  }

  const { stemmedQueryTerm, suggestions } = data;

  const NUMBER_OF_SUGGESTIONS_TO_DISPLAY = 6;
  const displayedSuggestions = suggestions.slice(
    0,
    NUMBER_OF_SUGGESTIONS_TO_DISPLAY
  );

  return (
    <ul
      className={classNames(
        className,
        "rounded-b-md shadow-common bg-white flex flex-col"
      )}
    >
      {displayedSuggestions.map((suggestion, index) => (
        <li
          key={index}
          className="px-6 py-3 hover:cursor-pointer hover:bg-slate-100"
          onClick={() => onSelect(suggestion)}
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
  );
}

export default SuggestionDropdown;
