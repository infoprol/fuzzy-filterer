import Search, {
  SearchArgsType,
  SearchPropsType,
} from "@/components/products/SearchBar";
import { Suspense } from "react";

import { default as pf } from "@/lib/products";
import { Product } from "@/lib/types";
import { useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import Tags from "@/components/products/Tags";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";

const SearchResults = ({ products }: { products: Product[] }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
      <AnimatePresence>
        {products.map((p) => (
          <motion.div
            layout
            className={styles.productCardCell}
            layoutId={p.id}
            key={p.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, animation: "linear" }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default async function Home({
  searchParams = { searchText: "", tags: [] },
}: {
  //searchParams: { [key: string]: string | string[] | undefined };
  searchParams: { searchText: string; tags: string[] };
}) {
  const searchText = (searchParams?.searchText as string) || "";

  let activeTags: string[] = [];
  switch (typeof searchParams.tags) {
    case "undefined":
      activeTags = [];
      break;
    case "string":
      activeTags = [searchParams.tags];
      break;
    default:
      activeTags = searchParams.tags;
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
    tags: activeTags,
  });
  const [availableTags, products] = await Promise.all([
    prAvailableTags,
    prProducts,
  ]);

  /////////////////////////

  return (
    <div>
      <Tags availableTags={availableTags} />
      <div>
        <SearchBar searchText={searchText} />
        <SearchResults products={products} />
      </div>
    </div>
  );
}
