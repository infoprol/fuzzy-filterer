import { default as pf } from "@/lib/products";

import { Suspense } from "react";
import ProductSearch from "@/components/products/ProductSearch";

type Props = {
  searchParams?: {
    searchText?: string;
    tags?: string;
  };
};

export default async function Home(props: Props) {
  //searchParams,
  // : {
  //   //searchParams: URLSearchParams;
  //   //searchParams: { [key: string]: string | string[] | undefined };
  //   //searchParams: { searchText: string | undefined; tags: string[] | undefined };
  // }) {
  async function doSearch({
    searchText = "",
    tags = [],
  }: {
    searchText: string;
    tags: string[];
  }) {
    "use server";
    return pf.searchProducts({ searchText, tags });
  }

  const searchText = props?.searchParams?.searchText || "";
  const tags = props?.searchParams?.tags || "";

  const availableTags = await pf.getAllAvailableTags();
  const products = await pf.searchProducts({ searchText, tags: [tags] });

  /////////////////////////

  return (
    <Suspense fallback={<h3>loading search...</h3>}>
      <ProductSearch
        products={products}
        availableTags={availableTags}
        doSearch={doSearch}
      />
    </Suspense>
  );
}
