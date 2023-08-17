import { Suspense } from 'react'
import Loading from './loading'

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      {/* <Suspense fallback={<Loading />}>{children}</Suspense> */}
    </>
  )
}
