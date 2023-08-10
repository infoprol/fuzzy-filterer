////
// this is, essentially, the module that holds and exports all the singletons
// i have defined for use in the SERVER (route handlers and RSCs).
//

import Fuse from "fuse.js"
import { Product } from "@/lib/types"

import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'

import { GetProductInput, SearchProductsInput, } from '@/lib/types/graphql'
import allProductsRaw from '@/lib/cleaned-data.json'
import { typeDefs } from '@/lib/types/graphql'



const allProducts = allProductsRaw as Product[]




// fuse stuff
function consFuseOpts() {
  return ["name", "tags"]
}

function consFuse(
  {
    opts,
    data,
  }: {
    opts: object | undefined
    data: Product[] | undefined
  } = { opts: undefined, data: undefined }
): Fuse<Product> {
  data = (data || allProducts) as Product[]
  opts = (opts || consFuseOpts) as object

  const fuse = new Fuse(data, opts)
  return fuse
}

export const productsFuse = new Fuse<Product>(allProducts, { keys: ["name", "tags"] })




// // i image there is an easier way to do this...
// const getTypeDefs = async () => {
//   const filePath = path.resolve('.', 'src/graphql/schemal.graphql')
//   const typeDefsBuf = await new Promise<Buffer>(
//     (resolve, reject) =>
//       fs.readFile(
//         filePath,
//         (err, buf) =>
//           err ? reject(err) : resolve(buf)))

//   return typeDefsBuf.toString('utf-8')
// }

// const typeDefs = await getTypeDefs()

//typeDefs
///const filePath = path.resolve('.', 'src/graphql/schemal.graphql')
//const typeDefs = readFileSync(filePath, 'utf-8')
// 
// const filePath = path.resolve('.', 'src/graphql/schemal.graphql')
// 
// const ls = fs.readdirSync('.')
// console.log(JSON.stringify({
//   FILEPATH: {
//     filePath,
//   }
// }, undefined, "\n"))


//// apollo stuff
// apollo server stuff

//helper
const consIsTagged = (tags: string[]) => (p: Product) => {
  if (tags.length < 1) return true
  for (let t of tags) {
    if (!p.tags.includes(t)) return false
  }
  return true
}

export const allAvailableTags = 
  Object.keys(
    allProducts
      .reduce((acc: string[], { tags }) => [...acc, ...tags], [] as string[])
      .reduce((acc: object, elem: string) => ({ [elem]: true, ...acc }), {})
  ).sort()  // not overly concerned about how the tags are sorted, just so it is consistent (as of this writing, anyway).


export const getProductById = (id:string) => allProducts.filter(x => x.id === (id as string)).at(0)


//resolvers
const resolvers = {
  Query: {
    getTags: () => allAvailableTags,  // not overly concerned about how the tags are sorted, just so it is consistent (as of this writing, anyway).

    getProduct: (_: any, {id}:GetProductInput) => getProductById(id),
        
    searchProducts: (_: any, {searchText, tags}:SearchProductsInput) => {
      
      // empty search text
      if (searchText.trim().length < 1) {
        if (tags.length < 1)
          return [ ...allProducts ]

        const isTagged = consIsTagged(tags)
        const ansP = allProducts.filter(isTagged)
          return ansP
      }
  
      const isTagged = consIsTagged(tags)
  
      const fuseAns = productsFuse.search(searchText)
      const products = fuseAns.map(({ item }) => item).filter(isTagged)
      
      return products
    }
  }  
}

const server = new ApolloServer({
  resolvers,
  typeDefs,
})

export const apolloNextHandler = startServerAndCreateNextHandler(server)




// apollo client stuff

import { ApolloLink, HttpLink } from "@apollo/client"
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr"

export function makeApolloClient() {
  const httpLink = new HttpLink({
      uri: process.env.GRAPHQL_SERVER_URI,
      fetchOptions: { cache: "no-store" },
  })

  return new NextSSRApolloClient({
      cache: new NextSSRInMemoryCache(),
      link:
          typeof window === "undefined"
              ? ApolloLink.from([
                    new SSRMultipartLink({
                        stripDefer: true,
                    }),
                    httpLink,
                ])
              : httpLink,
  })
}

