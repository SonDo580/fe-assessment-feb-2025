import classNames from "classnames";
import { ChangeEvent, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ClearButton from "./ClearButton";
import SearchButton from "./SearchButton";
import SearchInput, { SearchInputRef } from "./SearchInput";
import SuggestionDropdown from "./SuggestionDropdown";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const searchInputRef = useRef<SearchInputRef>(null);
  const shouldShowDropdown =
    !!keyword && (searchInputRef.current?.isFocused as boolean);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onSearch = () => {
    searchInputRef.current?.blur();

    if (keyword) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("q", keyword);
      setSearchParams(newSearchParams);
    }
  };

  return (
    <div className="px-40 py-10 shadow-common">
      <div className="flex gap-0">
        <div className="grow relative">
          <SearchInput
            ref={searchInputRef}
            value={keyword}
            onChange={onInputChange}
            onSearch={onSearch}
            shouldShowDropdown={shouldShowDropdown}
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
        <SearchButton onClick={onSearch} />
      </div>
    </div>
  );
}

export default Search;
