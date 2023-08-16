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
  showSuggestions,
}: {
  suggestions: Suggestion[];
  showSuggestions: boolean;
}) => {
  //
  // <label for="countries_multiple" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>

  if (!showSuggestions) return <></>;
  return (
    <>
      <select
        multiple
        id="suggestions"
        className={
          `${showSuggestions ? "" : "hidden "}` +
          "absolute bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        }
      >
        {suggestions.map(({ id, text }) => (
          <option key={id} value={id} className="block px-4 rounded-sm">
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
  //
  //   return (
  //     <div>
  //       <div className=" overflow-hidden">
  //         <div
  //           className="bg-[#fffebe] position- justify-center ml-1/2 w-1/3 z-100"
  //           ref={searchBarRef}
  //         >
  //           <input
  //             type="text"
  //             placeholder="search..."
  //             className=" text-center color-black decoration-none min-h-[3rem] rounded-md w-full flex flex-row justify-center text-sm p-[0.2rem] z-6 bg-pink-400 border-l-4 border-color-green ml-1/2"
  //             // onChange={handleSearch}
  //             onChange={(e) => setSearchText(e.target.value)}
  //             value={searchText}
  //             //onKeyDown={handleSearchInputKeys}
  //           />
  //           <div className="text-sm flex flex-col justify-center w-full border-t-0 divide-y divide-indigo-50 mt-0 overflow-auto z-5  rounded-md bg-color-burlywood opacity-90">
  //             <SuggestionsDropdown suggestions={suggestions} />
  //             {/* {suggestions.map((suggestion, indx) => (
  //                 <div
  //                   className="text-sm font-normal p-[0.2rem] text-center color-black decoration-none min-h-[24px] justify-center"
  //                   key={indx}
  //                   // onKeyDown={suggestion.onKeyDown}
  //                   onClick={suggestion.onClick}
  //                 >
  //                   <span
  //                     // onKeyDown={suggestion.onKeyDown}
  //                     onClick={suggestion.onClick}
  //                   >
  //                     {suggestion.text}
  //                   </span>
  //                 </div>
  //               ))} */}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="flex justify-center items-center">
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
          {/* <button
            type="submit"
            className=" absolute stop-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
          </button> */}
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
