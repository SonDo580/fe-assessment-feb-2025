import classNames from "classnames";
import { ChangeEvent, useState } from "react";

import ClearButton from "./ClearButton";
import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";
import SuggestionDropdown from "./SuggestionDropdown";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

function Search() {
  const [keyword, setKeyword] = useState("");
  const { updateSearchParam } = useUpdateSearchParams();
  const shouldShowDropdown = !!keyword;

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onSearch = () => {
    if (keyword) {
      updateSearchParam("q", keyword);
    }
  };

  return (
    <div className="px-40 py-10 shadow-common">
      <div className="flex gap-0">
        <div className="grow relative">
          <SearchInput
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
