import classNames from "classnames";

import ClearButton from "./ClearButton";
import SuggestionDropdown from "./SuggestionDropdown";

function SearchInput() {
  const shouldShowDropdown = false;

  return (
    <div className="grow relative">
      <input
        type="text"
        className={classNames(
          "w-full h-full p-2 pl-[22.98px]",
          "text-[#424242] text-base",
          "border-[1px] border-[#A4A4A4] rounded-l-md",
          "focus:ring-[0.5px] focus:ring-inset focus:outline-primary",
          shouldShowDropdown ? "rounded-bl-none" : ""
        )}
      />

      <ClearButton
        className={classNames(
          "absolute right-2 top-1/2 -translate-y-1/2",
          "cursor-pointer"
        )}
      />

      {shouldShowDropdown && (
        <SuggestionDropdown className="absolute left-0 right-0" />
      )}
    </div>
  );
}

export default SearchInput;
