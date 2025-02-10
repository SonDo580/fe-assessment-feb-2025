import classNames from "classnames";

import SearchIcon from "@/components/icons/SearchIcon";

function SearchButton() {
  return (
    <button
      className={classNames(
        "bg-primary text-white rounded-r-md px-8 py-4 -ml-[1px]",
        "flex justify-center items-center gap-2"
      )}
    >
      <SearchIcon />
      <span className="font-semibold text-[18px] leading-[26px] tracking-[0px]">
        Search
      </span>
    </button>
  );
}

export default SearchButton;
