"use client";

import { ApolloClient, gql, useQuery, useSuspenseQuery } from "@apollo/client";
import { notFound, useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";
import Loading from "./loading";
import ProductDetailWrapper from "@/components/products/ProductDetailWrapper";

export default function Page() {
  //{ params }: { params: { id: string } }) {
  const params = useParams();

  const id = params?.id as string;

  return (
    <Suspense fallback={<Loading />}>
      <ProductDetailWrapper id={id} />
    </Suspense>
  );
}
