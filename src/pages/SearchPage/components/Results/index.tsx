import queryResults from "@/mock/queryResults.json";
import ResultItem from "./ResultItem";

function Results() {
  const { TotalNumberOfResults, Page, PageSize, ResultItems } = queryResults;

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

      {/* <div>
        No results found for{" "}
        <span className="font-bold">example keyword</span>
      </div> */}
    </div>
  );
}

export default Results;
