import 'next/dynamic'

import { Suspense } from "react"
import ProductDetail from "@/components/products/ProductDetail"




export default function Page({
  params: { id },
}: {
  params: { id: string },
}) {


  return     <Suspense fallback={<div>loading product</div>}>
    <ProductDetail productId={id} />
    </Suspense>
}