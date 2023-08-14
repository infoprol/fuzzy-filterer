"use client";

import { Product } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import Tags from "./Tags";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import { default as pf } from "@/lib/products";

type DoSearchType = ({
  searchText,
  tags,
}: {
  searchText: string;
  tags: string[];
}) => Promise<Product[]>;

// server methods may NOT
export async function generateStaticParams() {
  return {
    doSearch: () => new Promise(() => []),
  };
}

async function ProductSearch({
  //  doSearch,
  availableTags = [],
  products = [],
}: {
  doSearch: DoSearchType | undefined;
  products: Product[];
  availableTags: string[];
}) {
  const searchParams = useSearchParams();
  const searchText = searchParams.get("searchText") || "";
  const tags = searchParams.getAll("tags") || [];

  //const products = await doSearch({ searchText, tags });

  return (
    <div>
      <Tags availableTags={availableTags} activeTags={tags} />
      <div>
        <SearchBar searchText={searchText} products={products} tags={tags} />
        <SearchResults products={products} />
      </div>
    </div>
  );
}

export default ProductSearch;
