import { useSearchParams } from "react-router-dom";

import { useQuery } from "@/hooks/useQuery";
import { searchEndpoint } from "@/services/api-endpoints";
import { TSeachResults } from "@/types";
import ResultItem from "./ResultItem";
import ResultsWrapper from "./ResultsWrapper";

function Results() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const { loading, data, errorMsg } = useQuery<TSeachResults>({
    url: keyword && `${searchEndpoint}?keyword=${keyword}`,
  });

  if (!keyword) {
    return;
  }

  if (loading) {
    return (
      <ResultsWrapper>
        <div className="text-xl">Loading...</div>
      </ResultsWrapper>
    );
  }

  if (errorMsg) {
    return (
      <ResultsWrapper>
        <div className="text-xl text-red-700">{errorMsg}</div>
      </ResultsWrapper>
    );
  }

  if (!data) {
    return;
  }

  const { TotalNumberOfResults, Page, PageSize, ResultItems } = data;
  if (TotalNumberOfResults === 0) {
    return (
      <ResultsWrapper>
        <div className="text-xl">
          No results found for <span className="font-bold">keyword</span>
        </div>
      </ResultsWrapper>
    );
  }

  const start = (Page - 1) * PageSize + 1;
  const end = start + ResultItems.length - 1;

  return (
    <ResultsWrapper>
      <div className="font-semibold text-[22px] leading-[28px] tracking-[0px] mb-10">
        Showing {start}-{end} of {TotalNumberOfResults} results
      </div>

      <div className="flex flex-col gap-10">
        {ResultItems.map((item) => (
          <ResultItem key={item.DocumentId} item={item} />
        ))}
      </div>
    </ResultsWrapper>
  );
}

export default Results;
