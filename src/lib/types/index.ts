export interface Product {
  id: string
  isActive: boolean
  price: number
  name: string
  about: string
  legacyId: string
  imageUrl: string
  tags: string[]
}

export interface QryArgs {
  searchText: string
  tags: string[]
}
