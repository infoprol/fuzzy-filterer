import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"

import allProducts from "src/lib/cleaned-data.json"
import { productsFuse } from "src/lib"
import { Product } from "../types"

//interface GetProductsInput
//  extends Pick<Prisma.ProductFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

interface GetProductsInput {
  query: string
  tags: string[]
}

const extractTags = (pp: Product[]) =>
  Object.keys(
    pp
      .reduce((acc, { tags }) => [...acc, ...tags], [])
      .reduce((acc: object, elem: string) => ({ [elem]: true, ...acc }), {})
  ).sort()
const availableTags = extractTags(allProducts)

const consIsTagged = (tags: string[]) => (p: Product) => {
  console.log(`tags: ${tags.join(",")}`)
  console.log(`p: ${JSON.stringify(p.tags)}`)
  if (tags.length < 1) return true

  for (let t of tags) {
    console.log(`testing ${t} against ${p.tags.join(",")}`)
    if (!p.tags.includes(t)) return false
  }
  return true
}

export default resolver.pipe(
  (x) => x,
  //resolver.authorize(),
  async ({ query = "", tags = [] }: GetProductsInput) => {
    const defaultAns = { nextPage: 2, hasMore: false, availableTags }

    console.log(`got search query: ${query}, tags: ${tags}`)

    // empty search text
    if (query.trim().length < 1) {
      if (tags.length < 1)
        return { ...defaultAns, products: [...allProducts], count: allProducts.length }

      const isTagged = consIsTagged(tags)
      //console.log(`allProducts: ${JSON.stringify(allProducts.map(x => x.tags))}`)
      const ansP = allProducts.filter(isTagged)

      console.log(`ansP: ${JSON.stringify(ansP.length)}`)
      return { ...defaultAns, products: ansP, count: ansP.length }
    }

    const isTagged = consIsTagged(tags)

    const fuseAns = productsFuse.search(query)
    const products = fuseAns.map(({ item }) => item).filter(isTagged)

    console.log(JSON.stringify(products.length))

    return {
      ...defaultAns,
      products,
      count: products.length,
    }
  }
)

//     // TODO: in multi-tenant app, you must add validation to ensure correct tenant
//     const {
//       items: products,
//       hasMore,
//       nextPage,
//       count,
//     } = await paginate({
//       skip,
//       take,
//       count: () => db.product.count({ where }),
//       query: (paginateArgs) => db.product.findMany({ ...paginateArgs, where, orderBy }),
//     })

//     return {
//       products,
//       nextPage,
//       hasMore,
//       count,
//     }
//   }
// )
