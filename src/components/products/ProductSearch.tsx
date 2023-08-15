"use client";

import { Product } from "@/lib/types";
import { Tags, SearchBar, SearchResults } from "@/components/products";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toQs, DEBOUNCE_MILLI_SEC } from "@/lib";

export type Props = {
  searchText: string;
  availableTags: string[];
  activeTags: string[];
  products: Product[];
};

export default function ProductSearch(props: Props) {
  const [searchText, setSearchText] = useState<string>(`${props.searchText}`);
  const [activeTags, setActiveTags] = useState<string[]>([...props.activeTags]);
  const router = useRouter();

  useEffect(() => {
    const debounced = setTimeout(() => {
      const qs = toQs({
        searchText,
        tags: activeTags,
      });
      router.push(`/products/?${qs}`);
    }, DEBOUNCE_MILLI_SEC);
  }, [activeTags, searchText]);

  return (
    <div>
      <Tags
        availableTags={props.availableTags}
        activeTags={activeTags}
        setActiveTags={setActiveTags}
      />
      <div>
        <SearchBar
          searchText={searchText}
          products={props.products}
          tags={activeTags}
          setSearchText={setSearchText}
        />
        <SearchResults products={props.products} />
      </div>
    </div>
  );
}
