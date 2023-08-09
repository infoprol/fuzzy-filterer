import Link from "next/link"
import { Suspense } from "react"

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <p>
          <Link href="./">Search All Products</Link>
        </p>
      </div>
      <Suspense fallback="loading product...">{children}</Suspense>
    </>
  )
}
