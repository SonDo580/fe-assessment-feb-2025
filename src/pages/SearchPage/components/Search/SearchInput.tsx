import classNames from "classnames";

function SearchInput() {
  return (
    <input
      type="text"
      className={classNames(
        "grow p-2 pl-[22.98px] border-[1px] border-[#A4A4A4] rounded-l-md",
        "focus:ring-[0.5px] focus:ring-inset focus:outline-primary"
      )}
    />
  );
}

export default SearchInput;
