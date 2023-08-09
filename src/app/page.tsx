import { Suspense } from "react"
import Search from "../products/components/Search"

export default async function Home() {
  return (
    <Suspense fallback="loading...">
      <Search />
    </Suspense>
  )
}
