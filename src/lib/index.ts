////
// this is, essentially, the module that holds and exports all the singletons
// i have defined for use in the SERVER (route handlers and RSCs).
//

import Fuse from "fuse.js";
import { Product } from "@/lib/types";

import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";

import { GetProductInput, SearchProductsInput } from "@/lib/graphql";
import allProductsRaw from "@/lib/cleaned-data.json";
import { typeDefs } from "@/lib/graphql";

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
  } = { opts: undefined, data: undefined }
): Fuse<Product> {
  data = (data || allProducts) as Product[];
  opts = (opts || consFuseOpts) as object;

  const fuse = new Fuse(data, opts);
  return fuse;
}

export const productsFuse = new Fuse<Product>(allProducts, {
  keys: ["name", "tags"],
});
