import classNames from "classnames";
import { Ref, useImperativeHandle } from "react";

import HighlightText from "@/components/ui/HighlightText";
import { produceSuggestionTextSegments } from "@/utils/produce-text-segments";
import { suggestionEndpoint } from "@/services/api-endpoints";
import { useQuery } from "@/hooks/useQuery";
import { TSuggestionResults } from "@/types";

export interface SuggestionDropdownRef {
  displayedSuggestions: string[];
}

interface IProps {
  className: string;
  keyword: string;
  onSelect: (suggestion: string) => void;
  activeIndex: number;
  ref: Ref<SuggestionDropdownRef>;
}

function SuggestionDropdown({
  activeIndex,
  keyword,
  className,
  onSelect,
  ref,
}: IProps) {
  const { loading, data, errorMsg } = useQuery<TSuggestionResults>({
    url: keyword && `${suggestionEndpoint}?keyword=${keyword}`,
  });

  const NUMBER_OF_SUGGESTIONS_TO_DISPLAY = 6;
  const displayedSuggestions =
    data?.suggestions.slice(0, NUMBER_OF_SUGGESTIONS_TO_DISPLAY) || [];

  useImperativeHandle(
    ref,
    () => ({
      displayedSuggestions,
    }),
    [data]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMsg) {
    return <div className="text-red-700">{errorMsg}</div>;
  }

  if (!data) {
    return;
  }

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
          className={classNames(
            "px-6 py-3 hover:cursor-pointer hover:bg-slate-100",
            activeIndex === index && "bg-slate-100"
          )}
          onClick={() => onSelect(suggestion)}
        >
          <HighlightText
            textSegments={produceSuggestionTextSegments(
              data.stemmedQueryTerm,
              suggestion
            )}
          />
        </li>
      ))}
    </ul>
  );
}

export default SuggestionDropdown;
