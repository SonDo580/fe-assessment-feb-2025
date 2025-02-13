import classNames from "classnames";
import { ChangeEvent, KeyboardEvent, Ref } from "react";

interface IProps {
  value: string;
  shouldShowDropdown: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyUp: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  ref: Ref<HTMLInputElement>;
}

function SearchInput({
  ref,
  value,
  onFocus,
  onBlur,
  onChange,
  onKeyUp,
  onKeyDown,
  shouldShowDropdown,
}: IProps) {
  return (
    <input
      type="text"
      ref={ref}
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      className={classNames(
        "w-full h-full py-2 pl-4 pr-8",
        "text-[#424242] text-base",
        "border-[1px] border-[rgb(164,164,164)] rounded-l-md",
        "focus:outline-none focus:border-primary",
        shouldShowDropdown && "rounded-bl-none"
      )}
    />
  );
}

export default SearchInput;
