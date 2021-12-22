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

export const ListColumns = {
  Title: "title",
  Finalized: "finalized",
  "Updated at": "updated_at",
}

export const ListItemColumns = {
  Name: "name",
  Cost: "cost",
  Amount: "amount",
  "Updated at": "updated_at",
}
