export type PaginationParams = {
  filter?: string
  sortBy?: string
  page?: number
  limit?: number
  asc?: boolean
}

export const ArticleColumns = {
  Name: "name",
  Price: "price",
  Store: "store",
  Category: "category",
  Brand: "brand",
  "Updated at": "updated_at",
}
