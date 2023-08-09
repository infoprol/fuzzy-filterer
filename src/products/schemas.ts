import { z } from "zod"

export const productSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  price: z.number(),
  picture: z.string(),
  name: z.string(),
  about: z.string(),
  legacyId: z.string(),
  imageUrl: z.string(),
  tags: z.array(z.string()),
})

export const CreateProductSchema = z.object({
  legacyId: z.string().optional(),
  isActive: z.string(),
  price: z.number(),
  imgUrl: z.string(),
  name: z.string(),
  about: z.string(),

  tags: z.array(
    z.object({
      value: z.string(),
    })
  ),

  // template: __fieldName__: z.__zodType__(),
})

export const ProductSchema = CreateProductSchema.extend({
  id: z.number(),
  isActive: z.boolean(),
  price: z.number(),
})

export const UpdateProductSchema = z.object({
  id: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteProductSchema = z.object({
  id: z.number(),
})
