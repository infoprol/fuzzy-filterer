import Link from 'next/link'

export default function notFound() {
  return (
    <div>
      <h3>Product Not Found!</h3>
      <Link href='/'>Back to Search</Link>
    </div>
  )
}
