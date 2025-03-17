import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";

import SuggestionsDropdown from "./SuggestionsDropdown";
import { useDebounce } from "@/hooks/useDebounce";
import {
  KeyboardKeys,
  MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS,
  NUMBER_OF_SUGGESTIONS_TO_DISPLAY,
} from "@/constants";
import { suggestionEndpoint } from "@/services/api-endpoints";
import { useQuery } from "@/hooks/useQuery";
import { TSuggestionResults } from "@/types";
import CloseIcon from "@/components/icons/CloseIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import { transformSuggestionResults } from "@/utils/transform-response";

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

  const transformResponseFn = useCallback(
    (data: TSuggestionResults) => transformSuggestionResults(data, keyword),
    [keyword]
  );

  const suggestionsQueryResponse = useQuery<TSuggestionResults>({
    url: shouldShowDropdown
      ? `${suggestionEndpoint}?keyword=${debouncedKeyword}`
      : "",
    transformResponseFn,
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
    e.preventDefault(); // prevent input from losing focus
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
    // Allow index -1 for the input value
    const n = displayedSuggestions.length;

    if (e.key === KeyboardKeys.ARROW_DOWN) {
      e.preventDefault(); // avoid moving across input string
      setActiveSuggestionIndex((prev) => (prev === n - 1 ? -1 : prev + 1));
    } else if (e.key === KeyboardKeys.ARROW_UP) {
      e.preventDefault(); // avoid moving across input string
      setActiveSuggestionIndex((prev) => (prev === -1 ? n - 1 : prev - 1));
    }
  };

  // Handle selecting suggestions or original keyword by keyboard
  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== KeyboardKeys.ENTER) {
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
          {/* Search input */}
          <input
            type="text"
            placeholder="Enter something"
            ref={searchInputRef}
            value={keyword}
            onChange={onInputChange}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            className={classNames(
              "w-full h-full py-2 pl-4 pr-8",
              "text-[#424242] text-base",
              "border-[1px] border-[rgb(164,164,164)] rounded-l-md",
              "focus:outline-none focus:border-primary",
              shouldShowDropdown && "rounded-bl-none"
            )}
          />

          {/* Clear button */}
          {shouldShowClearButton && (
            <button
              aria-label="clear-btn"
              onMouseDown={onClearInput}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <CloseIcon />
            </button>
          )}

          {shouldShowDropdown && (
            <SuggestionsDropdown
              onSelect={onSelectSuggestion}
              activeIndex={activeSuggestionIndex}
              {...suggestionsQueryResponse}
              className="absolute left-0 right-0"
            />
          )}
        </div>

        {/* Search button */}
        <button
          aria-label="search-btn"
          onClick={onSearch}
          className={classNames(
            "bg-primary text-white rounded-md px-8 py-4 -ml-1 z-10",
            "flex justify-center items-center gap-2",
            "hover:cursor-pointer hover:bg-blue-500"
          )}
        >
          <SearchIcon />
          <span className="font-semibold text-[18px] leading-[26px] hidden lg:inline">
            Search
          </span>
        </button>
      </div>
    </div>
  );
}

export default Search;
