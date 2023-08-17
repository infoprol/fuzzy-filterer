import { ApolloClient, gql, useQuery, useSuspenseQuery } from "@apollo/client";
import { notFound, useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";
import Loading from "./loading";
//import { GET } from "@/app/api/graphql/route";
//import { Query, QueryGetProductArgs, ProductResult } from "@/lib/graphql-codegened/graphql";
// import { graphql } from "@/lib/graphql-codegened/client/gql";
import ProductDetailWrapper from "@/components/products/ProductDetailWrapper";

//
// const GET_PRODUCT_QUERY = gql`
//   query getProductByIdQuery($getProductId: String!) {
//     getProduct(id: $getProductId) {
//       ...ProductFragment
//     }
//   }
// `;

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id as string;

  return (
    <Suspense fallback={<Loading />}>
      <ProductDetailWrapper id={id} />
    </Suspense>
  );
}
