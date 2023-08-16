"use client";

import { KeyboardEventHandler, useEffect, useRef, useState } from "react";

import useOutsideClick from "@/hooks/useOutsideClick";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";
import { DEBOUNCE_MILLI_SEC, toQs } from "@/lib";

export interface SearchPropsType {
  searchText: string;
  products: Product[];
  //tags: string[];
  setSearchText: (val: string) => void;
}

interface Suggestion {
  id: string;
  text: string;
  onClick: () => void;
}

const SuggestionsDropdown = ({
  suggestions,
}: {
  suggestions: Suggestion[];
}) => {
  //
  // <label for="countries_multiple" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
  return (
    <>
      <select
        multiple
        id="suggestions"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {suggestions.map(({ id, text }) => (
          <option key={id} value={id}>
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

  const searchBarRef = useRef(null);
  useOutsideClick(searchBarRef, () => setSuggestionsOpen(false));
  //
  //   useEffect(() => {
  //     const debounced = setTimeout(() => {
  //       const qs = toQs({
  //         searchText: searchInputVal,
  //         tags: tags,
  //       });
  //
  //       router.replace(`/?${qs}`);
  //     }, DEBOUNCE_MILLI_SEC);
  //   }, [searchInputVal, router, tags]);

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
      //onKeyDown: h,
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
  //
  //   return (
  //     <div>
  //       <div className="relative overflow-hidden">
  //         <div
  //           className="bg-[#fffebe] position-relative justify-center ml-1/2 w-1/3 z-100"
  //           ref={searchBarRef}
  //         >
  //           <input
  //             type="text"
  //             placeholder="search..."
  //             className="absolute text-center color-black decoration-none min-h-[3rem] rounded-md w-full flex flex-row justify-center text-sm p-[0.2rem] z-6 bg-pink-400 border-l-4 border-color-green ml-1/2"
  //             // onChange={handleSearch}
  //             onChange={(e) => setSearchText(e.target.value)}
  //             value={searchText}
  //             //onKeyDown={handleSearchInputKeys}
  //           />
  //           <div className="text-sm flex flex-col justify-center w-full border-t-0 divide-y divide-indigo-50 mt-0 overflow-auto z-5 absolute rounded-md bg-color-burlywood opacity-90">
  //             <SuggestionsDropdown suggestions={suggestions} />
  //             {/* {suggestions.map((suggestion, indx) => (
  //               <div
  //                 className="text-sm font-normal p-[0.2rem] text-center color-black decoration-none min-h-[24px] justify-center"
  //                 key={indx}
  //                 // onKeyDown={suggestion.onKeyDown}
  //                 onClick={suggestion.onClick}
  //               >
  //                 <span
  //                   // onKeyDown={suggestion.onKeyDown}
  //                   onClick={suggestion.onClick}
  //                 >
  //                   {suggestion.text}
  //                 </span>
  //               </div>
  //             ))} */}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="flex">
      <div className="relative w-full">
        <input
          type="search"
          id="search-dropdown"
          className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder="Search Mockups, Logos, Design Templates..."
          required
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        <button
          type="submit"
          className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </div>
      <div
        id="dropdown"
        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdown-button"
        >
          <li>
            <button
              type="button"
              className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Mockups
            </button>
          </li>
          <li>
            <button
              type="button"
              className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Templates
            </button>
          </li>
          <li>
            <button
              type="button"
              className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Design
            </button>
          </li>
          <li>
            <button
              type="button"
              className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Logos
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SearchBar;
