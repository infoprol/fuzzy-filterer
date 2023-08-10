import { Product } from '@/lib/types'
import { NextResponse } from 'next/server'

import allProducts from '@/lib/cleaned-data.json'
import { productsFuse } from '@/lib'


const consIsTagged = (tags: string[]) => (p: Product) => {
  console.log(`tags: ${tags.join(",")}`)
  console.log(`p: ${JSON.stringify(p.tags)}`)
  if (tags.length < 1) return true

  for (let t of tags) {
    console.log(`testing ${t} against ${p.tags.join(",")}`)
    if (!p.tags.includes(t)) return false
  }
  return true
}


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (productId) {
      const [product] = allProducts.filter(x => x.id === productId)
      if (product) return NextResponse.json(product)
      return { notFound: true }
    }

    const tags = searchParams.getAll('tags') || []
    const query = searchParams.get('query') || ''

    console.log(`got search query: ${query}, tags: ${tags}`)

    // empty search text
    if (query.trim().length < 1) {
      if (tags.length < 1)
        return NextResponse.json(allProducts)

      const isTagged = consIsTagged(tags)
      const ansP = allProducts.filter(isTagged)
        return NextResponse.json(ansP)
    }

    const isTagged = consIsTagged(tags)

    const fuseAns = productsFuse.search(query)
    const products = fuseAns.map(({ item }) => item).filter(isTagged)

    return NextResponse.json(products)
}