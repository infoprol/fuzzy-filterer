'use client'

import { makeApolloClient } from "@/lib"
import { gql, useSuspenseQuery } from "@apollo/client"
import { notFound, useRouter } from "next/navigation"
import Tags from "./Tags"
import { Product } from "@/lib/types"
import Image from "next/image"
import { Suspense } from "react"



const GET_PRODUCT_QUERY = gql`
  query Query($getProductId: String!) {
    getProduct(id: $getProductId) {
      id
      isActive
      price
      name
      about
      legacyId
      imageUrl
      tags
    }
  }
`

export default function ProductDetail({
  productId,
  
}: {
  productId: string ,
}) {

  const router = useRouter()
  const { data } = useSuspenseQuery(GET_PRODUCT_QUERY, { variables: { id: productId }})

  const { getProduct:maybeProduct } = data ? data as { getProduct: Product } : { getProduct: false }

  if (!maybeProduct) return notFound()

  const product = maybeProduct as Product

  const onTagSelect = async (tag: string) => {
    router.push(`/?query=&tags=${tag}`)
  }

  return (
    <>
      <Suspense>
      <Tags tags={product.tags} toggleTag={onTagSelect} />
      <div>
        <h1>Product {product.id}</h1>

        <h3>{product.name}</h3>
        <p>{product.about}</p>
        <Image src={`/img/${product.legacyId}.png`} alt="" height={480} width={480} />

        <pre>{JSON.stringify(product, null, 2)}</pre>
      </div>
      </Suspense>
    </>
  )
}