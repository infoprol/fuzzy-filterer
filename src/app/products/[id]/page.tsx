"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useQuery } from "@blitzjs/rpc"
import getProduct from "src/products/queries/getProduct"
import Tags from "src/products/components/Tags"
import { useParam } from "@blitzjs/next"

// export const ProductPage = ({ params }: { params: undefined | { id: string } }) => {

function Product() {
  const id = useParam("id", "string")
  const router = useRouter()
  const [product] = useQuery(getProduct, { id })

  const onTagSelect = async (tag: string) => {
    await router.push(`/?query=&tags=${tag}`)
  }

  return (
    <>
      <Tags tags={product.tags} toggleTag={onTagSelect} />
      <div>
        <h1>Product {product.id}</h1>

        <h3>{product.name}</h3>
        <p>{product.about}</p>
        <Image src={`/img/${product.legacyId}.png`} alt="" height={480} width={480} />

        <pre>{JSON.stringify(product, null, 2)}</pre>
      </div>
    </>
  )
}
export default Product
