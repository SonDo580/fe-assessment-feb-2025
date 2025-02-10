import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";

function Search() {
  return (
    <div className="px-40 py-10 shadow-[0px_4px_8px_4px_#E0E4E559]">
      <div className="flex gap-0 focus:border-primary-blue">
        <SearchInput />
        <SearchButton />
      </div>
    </div>
  );
}

export default Search;
