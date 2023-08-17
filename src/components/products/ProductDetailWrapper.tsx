"use client";

import { useSuspenseQuery } from "@apollo/client";
import ProductDetail from "./ProductDetail";
import { Product } from "@/lib/types";
import { GET_PRODUCT_QUERY } from "@/lib/graphql";

export default function ProductDetailWrapper({ id }: { id: string }) {
  const productId = id as string;

  const { data, client } = useSuspenseQuery(GET_PRODUCT_QUERY, {
    variables: { getProductId: productId },
  });
  client.stop();

  const { getProduct: product } = data as { getProduct: Product };
  return <ProductDetail product={product} />;
}
