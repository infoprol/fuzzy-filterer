////
// this is, essentially, the module that holds and exports all the singletons
// i have defined for use in the SERVER (route handlers and RSCs).
//

import Fuse from "fuse.js"
import products from "./cleaned-data.json"
import { Product } from "@/lib/types"

import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'

import { GetProductInput, SearchProductsInput, } from '@/lib/types/graphql'
import allProductsRaw from '@/lib/cleaned-data.json'
import { gql } from '@apollo/client'





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
  data = (data || products) as Product[]
  opts = (opts || consFuseOpts) as object

  const fuse = new Fuse(data, opts)
  return fuse
}

export const productsFuse = new Fuse<Product>(products, { keys: ["name", "tags"] })




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

const allProducts = allProductsRaw as Product[]

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

const typeDefs = gql`
type Product {
  id: String!
  isActive: Boolean
  price: Float
  name: String!
  about: String
  legacyId: String
  imageUrl: String
  tags: [String]
}

type Query {
  searchProducts(searchText: String, tags: [String]): [Product!]!
  getProduct(id: String!): Product
  getTags: [String!]!
}
`

//helper
const consIsTagged = (tags: string[]) => (p: Product) => {
  if (tags.length < 1) return true
  for (let t of tags) {
    if (!p.tags.includes(t)) return false
  }
  return true
}


//resolvers
const resolvers = {
  Query: {
    getTags: () =>
        Object.keys(
          allProducts
            .reduce((acc: string[], { tags }) => [...acc, ...tags], [] as string[])
            .reduce((acc: object, elem: string) => ({ [elem]: true, ...acc }), {})
        ).sort(),  // not overly concerned about how the tags are sorted, just so it is consistent (as of this writing, anyway).

    getProduct: (_: any, {id}:GetProductInput) =>
        allProducts.filter(x => x.id === (id as string)).at(0),

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

