import classNames from "classnames";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ClearButton from "./ClearButton";
import SearchButton from "./SearchButton";
import SearchInput, { SearchInputRef } from "./SearchInput";
import SuggestionDropdown, {
  SuggestionDropdownRef,
} from "./SuggestionDropdown";
import { useDebounce } from "@/hooks/useDebounce";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const debouncedKeyword = useDebounce(keyword);
  const searchInputRef = useRef<SearchInputRef>(null);
  const suggestionDropdownRef = useRef<SuggestionDropdownRef>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const shouldShowClearButton =
    !!keyword && (searchInputRef.current?.isFocused as boolean);

  const MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS = 2;
  const shouldShowDropdown =
    keyword.length >= MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS &&
    (searchInputRef.current?.isFocused as boolean);

  const displayedSuggestions =
    suggestionDropdownRef.current?.displayedSuggestions ?? [];

  // Reset activeSuggestionIndex when keyword changes
  useEffect(() => {
    setActiveSuggestionIndex(-1);
  }, [keyword]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onClearInput = () => {
    setKeyword("");
    searchInputRef.current?.focus();
  };

  const onSearch = () => {
    searchInputRef.current?.blur();

    if (keyword) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("q", keyword);
      setSearchParams(newSearchParams);
    }
  };

  const onSelectSuggestion = (suggestion: string) => {
    searchInputRef.current?.blur();

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("q", suggestion);
    setSearchParams(newSearchParams);
    setKeyword(suggestion);
  };

  // Handle navigating and selecting suggestions by keyboard
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (displayedSuggestions.length === 0) {
      return;
    }

    // Loop back when reach boundary
    if (e.key === "ArrowDown") {
      e.preventDefault(); // avoid moving across input string

      setActiveSuggestionIndex(
        (prev) => (prev + 1) % displayedSuggestions.length
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); // avoid moving across input string

      setActiveSuggestionIndex((prev) =>
        prev <= 0 ? displayedSuggestions.length - 1 : prev - 1
      );
    }
  };

  // Handle selecting suggestions or original keyword by keyboard
  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    if (activeSuggestionIndex === -1) {
      // Use search input
      onSearch();
    } else {
      // Use suggestion
      onSelectSuggestion(displayedSuggestions[activeSuggestionIndex]);
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
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
            shouldShowDropdown={shouldShowDropdown}
          />

          {shouldShowClearButton && (
            <ClearButton
              onClick={onClearInput}
              className={classNames(
                "absolute right-2 top-1/2 -translate-y-1/2",
                "cursor-pointer"
              )}
            />
          )}

          {shouldShowDropdown && (
            <SuggestionDropdown
              ref={suggestionDropdownRef}
              keyword={debouncedKeyword}
              className="absolute left-0 right-0"
              onSelect={onSelectSuggestion}
              activeIndex={activeSuggestionIndex}
            />
          )}
        </div>

        <SearchButton onClick={onSearch} />
      </div>
    </div>
  );
}

export default Search;
