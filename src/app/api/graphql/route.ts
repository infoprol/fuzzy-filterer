import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import fs, { readFileSync } from 'node:fs'
import path from 'node:path'

import { Product } from '@/lib/types'
import { GetTagsInput, GetProductInput, SearchProductsInput, } from '@/lib/types/graphql'
import allProductsRaw from '@/lib/cleaned-data.json'
import { productsFuse } from '@/lib'


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
const filePath = path.resolve('.', 'src/graphql/schemal.graphql')
const typeDefs = readFileSync(filePath, 'utf-8')

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

    searchProducts: (...args: any[]) => {
      
      console.log(`HEY HEY HEY GODDAMMIT\n\n${JSON.stringify({ args })}`)
      const searchText = 'dfsd'
      const tags = ['a']
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

const handler = startServerAndCreateNextHandler(server)

export async function GET(request: Request) {
  return handler(request)
}

export async function POST(request: Request) {
  return handler(request)
}