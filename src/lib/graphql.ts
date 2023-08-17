import { gql } from '@apollo/client'

export interface GetProductInput {
  id: string
}
export interface SearchProductsInput {
  searchText: string
  tags: string[]
}
export type GetTagsInput = void

// technically not a type, but...
export const typeDefs = gql`
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

export const GET_PRODUCT_QUERY = gql`
  query Query($getProductId: String!) {
    getProduct(id: $getProductId) {
      id
      isActive
      price
      name
      about
      legacyId
      imageUrl
      tags
    }
  }
`

const SEARCH_QUERY = gql`
  query SearchProducts($searchText: String = "", $tags: [String] = []) {
    searchProducts(searchText: $searchText, tags: $tags) {
      id
      isActive
      price
      imageUrl
      name
      about
      tags
      legacyId
    }
  }
`
