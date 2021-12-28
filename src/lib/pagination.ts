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

export const ArticlePagination = {
  filter: "",
  sortBy: ArticleColumns.Name,
  asc: true,
  page: 1,
  limit: 5,
}

export const ListColumns = {
  Title: "title",
  Finalized: "finalized",
  "Updated at": "updated_at",
}

export const ListsPagination = {
  filter: "",
  sortBy: ListColumns.Finalized,
  asc: true,
  page: 1,
  limit: 5,
}

export const ListItemColumns = {
  Name: "name",
  Cost: "cost",
  Amount: "amount",
  Store: "store",
  Category: "category",
  Brand: "brand",
  "Updated at": "updated_at",
}

export const ListPagination = {
  filter: "",
  sortBy: ListItemColumns["Updated at"],
  asc: true,
  page: 1,
  limit: 5,
}
