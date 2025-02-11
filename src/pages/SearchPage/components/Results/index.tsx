import { useSearchParams } from "react-router-dom";

import ResultItem from "./ResultItem";
import { useQuery } from "@/hooks/useQuery";
import { searchEndpoint } from "@/services/api-endpoints";
import { TSeachResults } from "@/types";

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
    return <div>Loading...</div>;
  }

  if (errorMsg) {
    return <div className="text-red-700">{errorMsg}</div>;
  }

  if (!data) {
    return;
  }

  const { TotalNumberOfResults, Page, PageSize, ResultItems } = data;
  if (TotalNumberOfResults === 0) {
    return (
      <div>
        No results found for <span className="font-bold">keyword</span>
      </div>
    );
  }

  const start = (Page - 1) * PageSize + 1;
  const end = start + ResultItems.length - 1;

  return (
    <div className="px-40">
      <div className="font-semibold text-[22px] leading-[28px] tracking-[0px] my-10">
        Showing {start}-{end} of {TotalNumberOfResults} results
      </div>

      <div className="flex flex-col gap-10">
        {ResultItems.map((item) => (
          <ResultItem key={item.DocumentId} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Results;
