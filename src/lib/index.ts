import Fuse from "fuse.js"
import products from "./cleaned-data.json"
import { Product } from "@/lib/types"

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
