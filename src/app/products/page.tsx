import { default as pf } from "@/lib/products";
import { parseListOfTags } from "@/lib";
import ProductSearch from "@/components/products/ProductSearch";

export default async function Home({
  searchParams: { searchText = "", tags = "" },
}: {
  searchParams: { searchText: string; tags: string };
}) {
  const activeTags = parseListOfTags(tags) || [];

  const prAvailableTags = pf.getAllAvailableTags();
  const prProducts = pf.searchProducts({ searchText, tags: activeTags });
  const [availableTags, products] = await Promise.all([
    prAvailableTags,
    prProducts,
  ]);

  return (
    <>
      <ProductSearch
        searchText={searchText}
        products={products}
        activeTags={activeTags}
        availableTags={availableTags}
      />
    </>
  );
}
