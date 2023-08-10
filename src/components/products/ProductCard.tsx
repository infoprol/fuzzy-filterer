"use client"

import React, { useTransition } from "react"
import Image from "next/image"
import { Product } from "../types"
import styles from "./ProductCard.module.css"
import { useRouter } from "next/navigation"
import { Routes } from "@blitzjs/next"

export type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const [_isPending, startTransition] = useTransition()

  const handleGoto = (e) => {
    startTransition(() => router.push(`/products/${product.id}`))
  }
  return (
    <div className={styles.productCard} onClick={handleGoto}>
      <h4>{product.name}</h4>

      <Image src={`/img/${product.legacyId}.png`} alt="" height={50} width={150} />
    </div>
  )
}

export default ProductCard
