"use client";

import { GET_PRODUCT_QUERY } from "@/lib/graphql";
import { useSuspenseQuery } from "@apollo/client";
import { notFound, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Loading from "./loading";
import { GET } from "@/app/api/graphql/route";
import { Query, QueryGetProductArgs } from "@/lib/graphql-codegened/graphql";
import { graphql } from "@/lib/graphql-codegened/gql";
import { Product } from "@/lib/types";
import { ProductDetail } from "@/components/products";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();

  const { data: product } = useSuspenseQuery<
    Query["getProduct"],
    QueryGetProductArgs
  >(GET_PRODUCT_QUERY, { variables: { id } });

  if (!product) notFound();

  return (
    <Suspense fallback={<Loading />}>
      <ProductDetail product={product as Product} />
    </Suspense>
  );
}
