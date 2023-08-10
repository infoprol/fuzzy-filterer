import { Suspense } from "react"
import Search from "@/components/products/Search"

export default async function Home() {

  

  return (
    <Suspense fallback="loading...">
      <Search query={""} tags={[]} availableTags={[]} />
    </Suspense>
  )
}
