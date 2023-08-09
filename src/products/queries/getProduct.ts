import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import allProducts from "src/lib/cleaned-data.json"

const GetProduct = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetProduct),
  (x) => x,
  async ({ id }) => {
    //const product = await db.product.findFirst({ where: { id } })

    const [product] = allProducts.filter((x) => x.id == id)

    if (!product) throw new NotFoundError()

    return product
  }
)
