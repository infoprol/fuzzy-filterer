import Search, {
  SearchArgsType,
  SearchPropsType,
} from "@/components/products/Search";
import { Suspense } from "react";

import { default as pf } from "@/lib/products";
import { Product } from "@/lib/types";

export default async function Home({
  searchParams,
}: {
  //searchParams: { [key: string]: string | string[] | undefined };
  searchParams: { searchText: string; tags: string[] };
}) {
  const searchText = (searchParams?.searchText as string) || "";
  const tags = !searchParams?.tags
    ? []
    : typeof searchParams.tags === typeof "string"
    ? [searchParams.tags]
    : searchParams.tags;

  // console.log(`calling updateSearchProps with ${JSON.stringify(newArgs)}}`)
  const prAvailableTags = pf.getAllAvailableTags();
  const prProducts = pf.searchProducts({
    searchText,
    tags,
  });
  const [availableTags, products] = await Promise.all([
    prAvailableTags,
    prProducts,
  ]);

  return (
    <Search
      products={products}
      availableTags={availableTags}
      searchText={searchText}
      tags={tags}
    />
  );
}
