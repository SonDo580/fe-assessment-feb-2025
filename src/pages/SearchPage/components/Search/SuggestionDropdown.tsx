import classNames from "classnames";

import HighlightText from "@/components/ui/HighlightText";
import { produceSuggestionTextSegments } from "@/utils/produce-text-segments";
import { suggestionEndpoint } from "@/services/api-endpoints";
import { useQuery } from "@/hooks/useQuery";
import { TSuggestionResults } from "@/types";

interface IProps {
  className: string;
  keyword: string;
}

function SuggestionDropdown({ keyword, className }: IProps) {
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
