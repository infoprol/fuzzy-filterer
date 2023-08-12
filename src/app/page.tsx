import Search from "@/components/products/Search"
import { Suspense } from 'react'

import { default as pf } from '@/lib/products'


export default async function Home({
  searchParams,
}: {
  searchParams: { [key:string]: string | string[] | undefined }
}) {

  const searchText = searchParams?.searchText as string || ''
  const tags = searchParams?.tags as string[] || []

  const prAvailableTags = pf.getAllAvailableTags()
  const prProducts = pf.searchProducts({
    searchText,
    tags
  })
  const [availableTags, products] = await Promise.all([
    prAvailableTags,
    prProducts
  ])

  return (
    <Suspense fallback="loading...">
      <Search query={""} tags={[]} availableTags={[]} />
    </Suspense>
  )
}
