////
// this is, essentially, the module that holds and exports all the singletons
// i have defined for use in the SERVER (route handlers and RSCs).
//

import Fuse from "fuse.js";
import { Product } from "@/lib/types";
import { QryArgs } from "@/lib/types";

import allProductsRaw from "@/lib/cleaned-data.json";

const allProducts = allProductsRaw as Product[];

// fuse stuff
function consFuseOpts() {
  return ["name", "tags"];
}

function consFuse(
  {
    opts,
    data,
  }: {
    opts: object | undefined;
    data: Product[] | undefined;
  } = { opts: undefined, data: undefined },
): Fuse<Product> {
  data = (data || allProducts) as Product[];
  opts = (opts || consFuseOpts) as object;

  const fuse = new Fuse(data, opts);
  return fuse;
}

export const productsFuse = new Fuse<Product>(allProducts, {
  keys: ["name", "tags"],
});

//// misc functions

const QS_DELIMITER = "|";
// maybe im missing something, but next does not seem like
// it is parsing my array-type qry strings when i use the form
//  `?tag=oil&tag=shampoo&tag=xxx`...  single-valued qry params
// go through fine.
// to lightly hack around this hassle, we have the following:
export const toQs = ({ searchText, tags }: QryArgs): string =>
  "searchText=" +
  encodeURIComponent(searchText) +
  "&tags=" +
  tags
    .map((x) => x.replaceAll(QS_DELIMITER, ""))
    .map(encodeURIComponent)
    .map((x) => `${x}`)
    .join("|");

// slight asymmetry here - pragmatics dictate(?)
export const parseListOfTags = (qsVal: string) =>
  qsVal.split(QS_DELIMITER).filter((x) => x.trim().length > 0);

//.map(decodeURIComponent)

export const DEBOUNCE_MILLI_SEC = parseInt(
  (process.env.DEBOUNCE_MILLI_SEC as string) || "250",
);
