import Search, {
  SearchArgsType,
  SearchPropsType,
} from "@/components/products/Search";
import { Suspense } from "react";

import { default as pf } from "@/lib/products";
import { Product } from "@/lib/types";

export default async function Home({
  searchParams = { searchText: "", tags: [] },
}: {
  //searchParams: { [key: string]: string | string[] | undefined };
  searchParams: { searchText: string; tags: string[] };
}) {
  const searchText = (searchParams?.searchText as string) || "";

  let tags: string[] = [];
  switch (typeof searchParams.tags) {
    case "undefined":
      tags = [];
      break;
    case "string":
      tags = [];
      break;
    default:
      tags = searchParams.tags;
      break;
  }

  //   searchParams?.tags
  //     ? typeof searchParams?.tags === "string" && [searchParams.tags]
  //     : (searchParams.tags?.map && searchParams.tags.map((t) => `${t}`)) || []
  // ) as string[];

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
