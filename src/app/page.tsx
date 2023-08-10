import 'next/dynamic'

import Search from "@/components/products/Search"
import { Suspense } from 'react'



export default async function Home() {
// 
//   // trying out async RSC functions with the availableTags,
//   // since those should be stable throughout the entire app life.
//   //
//   // to my understanding of the way this works, this client is going to
//   // get created each time this component is rendered (which should not be
//   // too often, again as far as my understanding (of Next v13) goes).
//   // i still feel like this is going to share some state with the
//   // apollo client that lives inside the ApolloProvider(Wrapper).
//   // we shall see...
//   const apolloClient = makeApolloClient()
//   const { data } = await apolloClient.query({ query: TAGS_QUERY })
//   const availableTags = data?.getTags ? data.getTags : []
//   
//   // otherwise this little fella just keeps polling our /api/graphql route!
//   apolloClient.stop()
// 


  return (
    <Suspense fallback="loading...">
      <Search query={""} tags={[]} availableTags={[]} />
    </Suspense>
  )
}
