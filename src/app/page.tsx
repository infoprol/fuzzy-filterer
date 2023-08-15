import { default as pf } from "@/lib/products";
import { parseListOfTags } from "@/lib";
import { Product } from "@/lib/types";
import { Tags, SearchBar, SearchResults } from "@/components/products";
import { ComponentProps } from "react";
import ProductSearch from "@/components/products/ProductSearch";

export default async function Home({
  searchParams: { searchText = "", tags = "" },
}: {
  searchParams: { searchText: string; tags: string };
}) {
  console.log(
    `rendering root ssc page - searchParams: ${JSON.stringify({
      searchText,
      tags,
    })}`,
  );

  const activeTags = parseListOfTags(tags) || [];

  const prAvailableTags = pf.getAllAvailableTags();
  const prProducts = pf.searchProducts({ searchText, tags: [tags] });
  const [availableTags, products] = await Promise.all([
    prAvailableTags,
    prProducts,
  ]);
  //
  //   return (
  //     <>
  //       <ProductSearch
  //         searchText={searchText}
  //         products={products}
  //         activeTags={activeTags}
  //         availableTags={availableTags}
  //       />
  //     </>
  //   );

  return <h3>hi</h3>;
}
