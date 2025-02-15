import classNames from "classnames";

import HighlightText from "@/components/ui/HighlightText";
import { produceSuggestionTextSegments } from "@/utils/produce-text-segments";

interface IProps {
  suggestion: string;
  queryTerm: string;
  active: boolean;
  onSelect: (suggestion: string) => void;
}

function SuggestionItem({ suggestion, queryTerm, active, onSelect }: IProps) {
  const onMouseDown = () => {
    onSelect(suggestion);
  };

  return (
    <li
      className={classNames(
        "px-6 py-3 hover:cursor-pointer hover:bg-slate-100",
        active && "bg-slate-100"
      )}
      onMouseDown={onMouseDown}
    >
      <HighlightText
        textSegments={produceSuggestionTextSegments(queryTerm, suggestion)}
      />
    </li>
  );
}

export default SuggestionItem;
