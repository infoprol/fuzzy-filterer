"use client";

import { useSuspenseQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import ProductDetail from "./ProductDetail";
import { Product } from "@/lib/types";
import { GET_PRODUCT_QUERY } from "@/lib/graphql";

export default function ProductDetailWrapper({ id }: { id: string }) {
  console.log(`params: ${JSON.stringify(id)}`);

  const productId = id as string;

  console.log("about to suspense query");
  const { data, client, stopPolling } = useSuspenseQuery(GET_PRODUCT_QUERY, {
    variables: { getProductId: productId },
  });
  client.stop();
  console.log(
    `client stopped and done suspense query - data=${JSON.stringify({ data })}`,
  );

  const { getProduct: product } = data as { getProduct: Product };
  return <ProductDetail product={product} />;
}
