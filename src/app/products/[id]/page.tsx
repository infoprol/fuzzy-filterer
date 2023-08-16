"use client";
//

import ProductDetail from "@/components/products/ProductDetail";
import pf from "@/lib/products";
import { notFound } from "next/navigation";

const { getProductById } = pf;

export default function Page({ params: { id } }: { params: { id: string } }) {
  const product = await getProductById({ id });
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
