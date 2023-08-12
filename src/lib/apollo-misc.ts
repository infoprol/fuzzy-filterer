import {
  consAllAvailableTags,
  consGetProductById,
  consSearchProducts,
} from "./products";
import { Product } from "@/lib/types";
import { productsFuse } from ".";
import allProducts from "./cleaned-data.json";
import { typeDefs } from "./graphql";

//// apollo stuff
// apollo server stuff

const getTags = consAllAvailableTags({ allProducts }),
  getProduct = consGetProductById({ allProducts }),
  searchProducts = consSearchProducts({ allProducts, productsFuse });

type TagsArgs = Parameters<typeof getTags>;

function get(f: (...args: any) => any) {
  type T = Parameters<typeof f>;
}

//resolvers
const resolvers = {
  Query: {
    getTags: (_: any, args: Parameters<typeof getTags>[0]) => getTags(args),
    getProduct: (_: any, args: Parameters<typeof getProduct>[0]) =>
      getProduct(args),
    searchProducts: (_: any, args: Parameters<typeof searchProducts>[0]) =>
      searchProducts(args),
  },
};

export const makeApolloServer = () =>
  new ApolloServer({
    resolvers,
    typeDefs,
  });

// apollo client stuff

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { ApolloServer } from "@apollo/server";

export function makeApolloClient() {
  const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_SERVER_URI,
    fetchOptions: { cache: "no-store" },
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}
