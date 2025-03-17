import { useSearchParams } from "react-router-dom";
import classNames from "classnames";

import { useQuery } from "@/hooks/useQuery";
import { searchEndpoint } from "@/services/api-endpoints";
import { TSearchResults } from "@/types";
import ResultItem from "./ResultItem";

function Results() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const { loading, data, errorMsg } = useQuery<TSearchResults>({
    url: keyword && `${searchEndpoint}?keyword=${keyword}`,
  });

  const wrapperClassNames = "px-8 md:px-40 pt-10";

  if (!keyword) {
    return;
  }

  if (loading) {
    return (
      <div className={classNames(wrapperClassNames, "text-xl")}>Loading...</div>
    );
  }

  if (errorMsg) {
    return (
      <div className={classNames(wrapperClassNames, "text-xl text-red-700")}>
        {errorMsg}
      </div>
    );
  }

  if (!data) {
    return;
  }

  const { TotalNumberOfResults, Page, PageSize, ResultItems } = data;
  if (TotalNumberOfResults === 0) {
    return (
      <div className={classNames(wrapperClassNames, "text-xl")}>
        No results found for <span className="font-bold">{keyword}</span>
      </div>
    );
  }

  const start = (Page - 1) * PageSize + 1;
  const end = start + ResultItems.length - 1;

  return (
    <div className={wrapperClassNames}>
      <div className="font-semibold text-[22px] leading-[28px] tracking-[0px] mb-10">
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
