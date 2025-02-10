import classNames from "classnames";
import ClearButton from "./ClearButton";

function SearchInput() {
  return (
    <div className="grow relative">
      <input
        type="text"
        className={classNames(
          "w-full h-full p-2 pl-[22.98px]",
          "border-[1px] border-[#A4A4A4] rounded-l-md",
          "focus:ring-[0.5px] focus:ring-inset focus:outline-primary"
        )}
      />

      <ClearButton
        className={classNames(
          "absolute right-2 top-1/2 -translate-y-1/2",
          "cursor-pointer"
        )}
      />
    </div>
  );
}

export default SearchInput;
