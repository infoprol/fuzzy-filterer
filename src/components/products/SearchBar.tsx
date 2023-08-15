"use client";

import { KeyboardEventHandler, useEffect, useRef, useState } from "react";

import useOutsideClick from "@/hooks/useOutsideClick";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";
import { DEBOUNCE_MILLI_SEC, toQs } from "@/lib";

export interface SearchPropsType {
  searchText: string;
  products: Product[];
  tags: string[];
  setSearchText: (val: string) => void;
}

function SearchBar({
  products = [],
  searchText = "",
  tags = [],
}: SearchPropsType) {
  const router = useRouter();

  const [searchInputVal, setSearchInputVal] = useState<string>(searchText);

  const [suggestionsOpen, setSuggestionsOpen] = useState<boolean>(false);
  const [currSelectedSuggestion, setCurrSelectedSuggestion] =
    useState<number>(-1);

  const searchBarRef = useRef(null);
  useOutsideClick(searchBarRef, () => setSuggestionsOpen(false));

  useEffect(() => {
    const debounced = setTimeout(() => {
      const qs = toQs({
        searchText: searchInputVal,
        tags: tags,
      });

      router.replace(`/?${qs}`);
    }, DEBOUNCE_MILLI_SEC);
  }, [searchInputVal, router, tags]);

  const nameSuggests = products.map(({ id, name }, indx) => {
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
      text: name,
      onKeyDown: h,
      onClick: () => {
        router.push(`/products/${id}`);
      },
    };
  });

  const suggestions = !suggestionsOpen || searchText === "" ? [] : nameSuggests; //.concat(tagSuggests);

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
    <div>
      <div className="relative overflow-hidden">
        <div
          className="bg-[#fffebe] position-relative justify-center ml-1/2 w-1/3 z-100"
          ref={searchBarRef}
        >
          <input
            type="text"
            placeholder="search..."
            className="absolute text-center color-black decoration-none min-h-[3rem] rounded-md w-full flex flex-row justify-center text-sm p-[0.2rem] z-6 bg-pink-400 border-l-4 border-color-green ml-1/2"
            // onChange={handleSearch}
            onChange={(e) => setSearchInputVal(e.target.value)}
            value={searchInputVal}
            onKeyDown={handleSearchInputKeys}
          />
          <div className="text-sm flex flex-col justify-center w-full border-t-0 divide-y divide-indigo-50 mt-0 overflow-auto z-5 absolute rounded-md bg-color-burlywood opacity-90">
            {suggestions.map((suggestion, indx) => (
              <div
                className="text-sm font-normal p-[0.2rem] text-center color-black decoration-none min-h-[24px] justify-center"
                key={indx}
                onKeyDown={suggestion.onKeyDown}
                onClick={suggestion.onClick}
              >
                <span
                  onKeyDown={suggestion.onKeyDown}
                  onClick={suggestion.onClick}
                >
                  {suggestion.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
