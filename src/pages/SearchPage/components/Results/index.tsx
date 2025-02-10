import queryResults from "@/mock/queryResults.json";
import ResultItem from "./ResultItem";

function Results() {
  return (
    <div className="px-40">
      <div className="font-semibold text-[22px] leading-[28px] tracking-[0px] my-10">
        Showing 1-10 of XXX results
      </div>

      <div className="flex flex-col gap-10">
        {queryResults.ResultItems.map((item) => (
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
