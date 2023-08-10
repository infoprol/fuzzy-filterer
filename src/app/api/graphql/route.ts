import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import { gql } from 'graphql-tag'
import allProducts from '../../../lib/cleaned-data.json'

const items =  [{"isActive":true,"_id":"001","picture":"/img/products/N0CA_430.png","name":"Damage Reverse Oil Conditioner","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","oil","conditioner"],"price":20},{"isActive":true,"_id":"002","picture":"/img/products/N0EN01_430.png","name":"Volume Advance Conditioner","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","conditioner"],"price":22},{"isActive":true,"_id":"003","picture":"/img/products/N0EY01_430.png","name":"Volume Advance Shampoo","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","shampoo"],"price":30},{"isActive":true,"_id":"004","picture":"/img/products/N0FP_430.png","name":"Damage Reverse Oil Shampoo","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","oil","shampoo"],"price":20},{"isActive":true,"_id":"005","picture":"/img/products/N0H101_430.png","name":"Color Sustain Pro","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","treatment"],"price":7},{"isActive":true,"_id":"006","picture":"/img/products/N0J801_430.png","name":"Damage Reverse Hair Serum","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","serum"],"price":38},{"isActive":true,"_id":"007","picture":"/img/products/N0J901_430.png","name":"Damage Reverse Restorative Hair Treatment","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","treatment"],"price":38},{"isActive":true,"_id":"008","picture":"/img/products/N0PL01_430.png","name":"Super Sleek Conditioner","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","conditioner"],"price":27},{"isActive":true,"_id":"009","picture":"/img/products/N0YJ01_430.png","name":"Rare Blend Oil","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","oil","rare blend"],"price":17},{"isActive":true,"_id":"010","picture":"/img/products/N08X_430.png","name":"Dry Recovery Hydrating Shampoo","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","hydrating","shampoo"],"price":22},{"isActive":true,"_id":"011","picture":"/img/products/N08Y_430.png","name":"Dry Recovery Hydrating Conditioner","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","hydrating","conditioner"],"price":22},{"isActive":true,"_id":"012","picture":"/img/products/N12R01_430.png","name":"Rare Blend Deep Conditioner","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","conditioner","rare blend"],"price":12},{"isActive":true,"_id":"013","picture":"/img/products/N13J01_430.png","name":"Rare Blend Moisture-Rich Cleansing Conditioner","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","cleansing","conditioner","rare blend"],"price":25},{"isActive":true,"_id":"014","picture":"/img/products/N15E01_430.png","name":"Rare Blend Protecting Treatment","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","treatment","rare blend"],"price":17},{"isActive":true,"_id":"015","picture":"/img/products/N17R01_430.png","name":"Rare Blend Oil Rejuvenating Therapy Lightweight Texture","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","oil","rare blend"],"price":15},{"isActive":false,"_id":"016","picture":"/img/products/N098_430.png","name":"Damage Reverse Restorative Hair Treatment","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","treatment"],"price":25},{"isActive":true,"_id":"017","picture":"/img/products/N16201_430.png","name":"Rare Blend Infusion Shampoo","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","shampoo","rare blend"],"price":17},{"isActive":true,"_id":"018","picture":"/img/products/N16401_430.png","name":"Damage Reverse Thickening Shampoo","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","shampoo"],"price":20},{"isActive":false,"_id":"019","picture":"/img/products/N16501_430.png","name":"Damage Reverse Thickening Conditioner","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","conditioner"],"price":23},{"isActive":false,"_id":"020","picture":"/img/products/N19601_430.png","name":"Rare Blend Oil Moisture Therapy Medium Texture","about":"Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.","tags":["ojon","texture"],"price":40}]


const typeDefs = gql`
  type Item {
    _id: String
    isActive: Boolean
    price: Float
    pictureUrl: String
    name: String
    about: String
    tags: [String]
  }

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
    getItems(searchString: String): [Item]
    searchProducts(searchtText: String, tags:[String]): [String!]!
    getProduct(id:String!): Product
    getTags: [String!]!
  }
`

const resolvers = {
  Query: {
    getItems: (_:any, {searchString}:{searchString:string}) => {
      console.log(`searchString: ${searchString}`)
      const txt = searchString.toLowerCase()
      const ans = items.filter(item => item && item.name && item.name.toLowerCase().includes(txt))
      return ans
    },
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