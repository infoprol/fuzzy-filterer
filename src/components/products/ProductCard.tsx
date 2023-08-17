'use client'

import React, { useTransition } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { useRouter } from 'next/navigation'

export type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const [_isPending, startTransition] = useTransition()

  const handleGoto = () => {
    startTransition(() => router.push(`/products/${product.id}`))
  }
  return (
    <div
      className='w-full h-full text-center rounded-lg flex flex-row flex-wrap justify-center overflow-hidden bg-purple-300'
      onClick={handleGoto}
    >
      <h4>{product.name}</h4>

      <Image
        src={`/img/${product.legacyId}.png`}
        alt=''
        height={50}
        width={150}
      />
    </div>
  )
}

export default ProductCard
