import { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";

import ClearButton from "./ClearButton";
import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";
import SuggestionsDropdown from "./SuggestionsDropdown";
import { useDebounce } from "@/hooks/useDebounce";
import {
  MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS,
  NUMBER_OF_SUGGESTIONS_TO_DISPLAY,
} from "@/constants";
import { suggestionEndpoint } from "@/services/api-endpoints";
import { useQuery } from "@/hooks/useQuery";
import { TSuggestionResults } from "@/types";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const debouncedKeyword = useDebounce(keyword);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const shouldShowClearButton = isInputFocused && keyword.length > 0;
  const shouldShowDropdown =
    isInputFocused && keyword.length >= MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS;

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const suggestionsQueryResponse = useQuery<TSuggestionResults>({
    url: shouldShowDropdown
      ? `${suggestionEndpoint}?keyword=${debouncedKeyword}`
      : "",
  });

  const displayedSuggestions =
    suggestionsQueryResponse.data?.suggestions.slice(
      0,
      NUMBER_OF_SUGGESTIONS_TO_DISPLAY
    ) ?? [];

  // Reset activeSuggestionIndex when keyword changes
  useEffect(() => {
    setActiveSuggestionIndex(-1);
  }, [keyword]);

  const onInputFocus = () => {
    setIsInputFocused(true);
  };

  const onInputBlur = () => {
    setIsInputFocused(false);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onClearInput = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // prevent input from losing focus
    setKeyword("");
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
    // Allow index -1 for the input value
    const n = displayedSuggestions.length;

    if (e.key === "ArrowDown") {
      e.preventDefault(); // avoid moving across input string
      setActiveSuggestionIndex((prev) => (prev === n - 1 ? -1 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); // avoid moving across input string
      setActiveSuggestionIndex((prev) => (prev === -1 ? n - 1 : prev - 1));
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
    <div className="px-8 md:px-40 py-10 shadow-common">
      <div className="flex gap-0">
        <div className="grow relative">
          <SearchInput
            ref={searchInputRef}
            value={keyword}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            onChange={onInputChange}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
            shouldShowDropdown={shouldShowDropdown}
          />

          <ClearButton
            onClearInput={onClearInput}
            className={classNames(
              "absolute right-2 top-1/2 -translate-y-1/2",
              !shouldShowClearButton && "hidden"
            )}
          />

          <SuggestionsDropdown
            onSelect={onSelectSuggestion}
            activeIndex={activeSuggestionIndex}
            {...suggestionsQueryResponse}
            className={classNames(
              "absolute left-0 right-0",
              !shouldShowDropdown && "hidden"
            )}
          />
        </div>

        <SearchButton onClick={onSearch} />
      </div>
    </div>
  );
}

export default Search;
