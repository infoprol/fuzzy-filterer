import { Product } from "@/lib/types";
import Fuse from "fuse.js";
import allProductsRaw from "@/lib/cleaned-data.json";
import { productsFuse } from ".";

const consIsTagged = (tags: string[]) => (p: Product) => {
  if (tags.length < 1) return true;
  for (let t of tags) {
    if (!p.tags.includes(t)) return false;
  }
  return true;
};

export const consAllAvailableTags =
  ({ allProducts }: { allProducts: Product[] }) =>
  async (...args: any) => {
    return Object.keys(
      allProducts
        .reduce((acc: string[], { tags }) => [...acc, ...tags], [] as string[])
        .reduce((acc: object, elem: string) => ({ [elem]: true, ...acc }), {})
    ).sort(); // not overly concerned about how the tags are sorted, just so it is consistent (as of this writing, anyway).
  };

export const consGetProductById =
  ({ allProducts }: { allProducts: Product[] }) =>
  async ({ id }: { id: string }) =>
    allProducts.filter((x) => x.id === (id as string)).at(0);

export const consSearchProducts =
  ({
    allProducts,
    productsFuse,
  }: {
    allProducts: Product[];
    productsFuse: Fuse<Product>;
  }) =>
  async ({ searchText, tags }: { searchText: string; tags: string[] }) => {
    // empty search text
    if (searchText.trim().length < 1) {
      if (tags.length < 1) return [...allProducts];

      const isTagged = consIsTagged(tags);
      const ansP = allProducts.filter(isTagged);
      return ansP;
    }

    const isTagged = consIsTagged(tags);

    const fuseAns = productsFuse.search(searchText);
    const products = fuseAns.map(({ item }) => item).filter(isTagged);

    return products;
  };

const allProducts = allProductsRaw as Product[];

// export sensible defaults
const ProductFuncs = {
  getAllAvailableTags: consAllAvailableTags({ allProducts }),
  getProductById: consGetProductById({ allProducts }),
  searchProducts: consSearchProducts({ allProducts, productsFuse }),
};
export default ProductFuncs;
