"use client";

import {
  KeyboardEventHandler,
  MouseEventHandler,
  useRef,
  useState,
  useTransition,
} from "react";

import useOutsideClick from "@/hooks/useOutsideClick";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

export interface SearchPropsType {
  searchText: string;
  products: Product[];
  setSearchText: (val: string) => void;
}

interface Suggestion {
  id: string;
  text: string;
  onClick: () => void;
}

const SuggestionsDropdown = ({
  suggestions,
  showSuggestions,
}: {
  suggestions: Suggestion[];
  showSuggestions: boolean;
}) => {
  const router = useRouter();
  const [_, startTransition] = useTransition();

  const handleSuggestionClicked: MouseEventHandler<HTMLOptionElement> = (e) => {
    const id = e.currentTarget.value;

    startTransition(() => router.push(`/products/${id}`));
  };

  if (!showSuggestions) return <></>;
  return (
    <>
      <select
        multiple
        id="suggestions"
        size={suggestions.length}
        className={
          `${showSuggestions ? "" : "hidden "}` +
          "absolute z-40 opacity-90 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        }
      >
        {suggestions.map(({ id, text }) => (
          <option
            key={id}
            value={id}
            className="block px-4 rounded-sm"
            onClick={handleSuggestionClicked}
          >
            {text}
          </option>
        ))}
      </select>
    </>
  );
};

function SearchBar({
  products,
  searchText,
  // tags,
  setSearchText,
}: SearchPropsType) {
  const router = useRouter();

  const [searchInputVal, setSearchInputVal] = useState<string>(searchText);

  const [suggestionsOpen, setSuggestionsOpen] = useState<boolean>(true);
  const [currSelectedSuggestion, setCurrSelectedSuggestion] =
    useState<number>(-1);

  const showSuggestions = suggestionsOpen && searchText !== "";

  const searchBarRef = useRef(null);
  useOutsideClick(
    searchBarRef,
    () => setSuggestionsOpen(false),
    () => setSuggestionsOpen(true),
  );

  const nameSuggests: Suggestion[] = products.map(({ id, name }, indx) => {
    const h: KeyboardEventHandler<HTMLDivElement> = (event) => {
      if (currSelectedSuggestion !== indx) return;

      switch (event.key) {
        case "Enter":
          router.push(`/products/${id}`);
          break;

        case "Escape":
          setSuggestionsOpen(false);
          break;

        case "ArrowDown":
          setCurrSelectedSuggestion(indx + (1 % products.length));
          break;

        case "ArrowUp":
          setCurrSelectedSuggestion(indx - (1 % products.length));
          break;
        default:
          break;
      }
    };

    return {
      id,
      text: name,
      onClick: () => {
        router.push(`/products/${id}`);
      },
    };
  });

  const suggestions = !showSuggestions ? [] : nameSuggests; //.concat(tagSuggests);

  const handleSearchInputKeys: KeyboardEventHandler<HTMLInputElement> = async (
    evt,
  ) => {
    //
    // if (evt.key.match(/^[A-Za-z0-9\s]$/)) {
    //   const prevInputVal = searchInputVal;
    //   setSearchInputVal(prevInputVal + evt.key);
    //   setSuggestionsOpen(true);
    //   return;
    // }

    switch (evt.key) {
      case "Enter":
        if (
          currSelectedSuggestion < products.length &&
          currSelectedSuggestion > 0
        )
          router.push(`/products/${products[currSelectedSuggestion].id}`);
      case "Escape":
        setSuggestionsOpen(false);
        break;
      case "ArrowDown":
        setSuggestionsOpen(true);
        setCurrSelectedSuggestion(0);
        break;
      //TODO keydown, keyup for selecting suggestions with keyboard

      case "Backspace":
        const newSearchInputVal = searchInputVal.slice(0, -1);
        setSearchInputVal(newSearchInputVal);
        if (newSearchInputVal.length < 1) setSuggestionsOpen(false);
        break;

      case "Meta":
      case "Control":
      case "Alt":
      case "Shift":
      case "CapsLock":
      case "Tab":
      default:
        // const prevInputVal = searchInputVal;
        // setSearchInputVal(prevInputVal + evt.key);
        // setSuggestionsOpen(true);
        break;
    }
  };

  return (
    <div ref={searchBarRef} className="flex justify-center items-center">
      <div className=" w-1/3 relative">
        <div>
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Search..."
            required
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </div>

        <SuggestionsDropdown
          suggestions={suggestions}
          showSuggestions={showSuggestions}
        />
      </div>
    </div>
  );
}

export default SearchBar;
