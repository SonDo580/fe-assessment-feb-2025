import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";

function Search() {
  return (
    <div className="px-40 py-10 shadow-common">
      <div className="flex gap-0">
        <SearchInput />
        <SearchButton />
      </div>
    </div>
  );
}

export default Search;
