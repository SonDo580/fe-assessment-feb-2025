import classNames from "classnames";
import { ChangeEvent, KeyboardEvent, useRef } from "react";

interface IProps {
  value: string;
  shouldShowDropdown: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

function SearchInput({
  value,
  onChange,
  onSearch,
  shouldShowDropdown,
}: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <input
      type="text"
      ref={inputRef}
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp}
      className={classNames(
        "w-full h-full py-2 pl-[22.98px] pr-8",
        "text-[#424242] text-base",
        "border-[1px] border-[#A4A4A4] rounded-l-md",
        "focus:ring-[0.5px] focus:ring-inset focus:outline-primary",
        shouldShowDropdown ? "rounded-bl-none" : ""
      )}
    />
  );
}

export default SearchInput;
