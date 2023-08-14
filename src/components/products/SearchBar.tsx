"use client";

import {
  ChangeEvent,
  KeyboardEventHandler,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
// import "swiper/css"
// import "swiper/css/effect-coverflow"
// import "swiper/css/pagination"
// import "swiper/css/navigation"
//import { SwiperOptions } from "swiper/types"
import { motion, AnimatePresence } from "framer-motion";

import useOutsideClick from "@/hooks/useOutsideClick";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Search.module.css";
import ProductCard from "./ProductCard";
import Tags from "./Tags";
import { Product } from "@/lib/types";
import process from "node:process";

export interface SearchPropsType {
  searchText: string;
  tags: string[];
  products: Product[];
}

const DEBOUNCE_MILLI_SEC = parseInt(
  (process.env.DEBOUNCE_MILLI_SEC as string) || "300",
);

function SearchBar({
  searchText = "",
  tags = [],
  products = [],
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
      const qs = new URLSearchParams({
        searchText,
      });
      for (const t of tags) qs.append("tags", t);

      router.replace(`/?${qs}`);
    }, DEBOUNCE_MILLI_SEC);
  }, [searchInputVal, router]);

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

        default:
          break;
      }
    };

    return {
      text: name,
      onKeyDown: h,
      onClick: () => {
        router.push(`/products/${id}`);
        //await router.push(Routes.ShowProductPage({ productId: id }))
      },
    };
  });

  const suggestions = !suggestionsOpen || searchText === "" ? [] : nameSuggests; //.concat(tagSuggests);

  const handleSearchInputKeys: KeyboardEventHandler<HTMLInputElement> = async (
    evt,
  ) => {
    switch (evt.key) {
      case "Enter":
        if (
          currSelectedSuggestion < products.length &&
          currSelectedSuggestion > 0
        )
          router.push(`/products/${products[currSelectedSuggestion].id}`);
        break;
      case "Escape":
        setSuggestionsOpen(false);
        break;
      case "ArrowDown":
        setSuggestionsOpen(true);
        setCurrSelectedSuggestion(0);
        break;
      //TODO keydown, keyup for selecting suggestions with keyboard
      default:
        setSuggestionsOpen(true);
        break;
    }
  };

  return (
    <div>
      <div className={styles.searchContainer}>
        <div className={styles.searchBar} ref={searchBarRef}>
          <input
            type="text"
            placeholder="search..."
            className={styles.searchInput}
            // onChange={handleSearch}
            value={searchText}
            onKeyDown={handleSearchInputKeys}
          />
          <div className={styles.suggestionsContainer}>
            {suggestions.map((suggestion, indx) => (
              <div
                className={styles.suggestion}
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
