import classNames from "classnames";

import SearchIcon from "@/components/icons/SearchIcon";

interface IProps {
  onClick: () => void;
}

function SearchButton({ onClick }: IProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "bg-primary text-white rounded-md px-8 py-4 -ml-1 z-10",
        "flex justify-center items-center gap-2",
        "hover:cursor-pointer hover:bg-blue-500"
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
