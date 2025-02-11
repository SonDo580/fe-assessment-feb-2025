import classNames from "classnames";
import {
  ChangeEvent,
  KeyboardEvent,
  Ref,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export interface SearchInputRef {
  isFocused: boolean;
  focus: () => void;
  blur: () => void;
}

interface IProps {
  value: string;
  shouldShowDropdown: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyUp: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  ref: Ref<SearchInputRef>;
}

function SearchInput({
  ref,
  value,
  onChange,
  onKeyUp,
  onKeyDown,
  shouldShowDropdown,
}: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    isFocused,
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
  }));

  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  return (
    <input
      type="text"
      ref={inputRef}
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
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
