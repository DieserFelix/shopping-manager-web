import type { PaginationParams } from "."

export const remote = "http://localhost:8000/api"

const enum ApiRoutes {
  LOGIN = "/login",
  LOGOUT = "/logout",
  ARTICLES = "/articles",
  STORES = "/stores",
  CATEGORIES = "/categories",
  BRANDS = "/brands",
  LISTS = "/lists",
  ITEMS = "/items",
}

export function getLoginApiRoute() {
  return `${remote}${ApiRoutes.LOGIN}`
}

export function getLogoutApiRoute() {
  return `${remote}${ApiRoutes.LOGOUT}`
}

export function getArticlesApiRoute(params: {
  id?: number
  pagination?: PaginationParams
}) {
  const { id, pagination } = params
  const route = `${remote}${ApiRoutes.ARTICLES}/`
  if (pagination) {
    return paginate(`${route}`, pagination)
  }
  return `${route}${id ?? ""}`
}

export function getStoresApiRoute(params: {
  id?: number
  pagination?: PaginationParams
}) {
  const { id, pagination } = params
  const route = `${remote}${ApiRoutes.STORES}/`
  if (id !== undefined) {
    return `${route}${id}`
  }
  if (pagination) {
    return paginate(`${route}`, pagination)
  }
  return route
}

export function getCategoriesApiRoute(params: {
  id?: number
  pagination?: PaginationParams
}) {
  const { id, pagination } = params
  const route = `${remote}${ApiRoutes.CATEGORIES}/`
  if (id !== undefined) {
    return `${route}${id}`
  }
  if (pagination) {
    return paginate(`${route}`, pagination)
  }
  return route
}

export function getBrandsApiRoute(params: {
  id?: number
  pagination?: PaginationParams
}) {
  const { id, pagination } = params
  const route = `${remote}${ApiRoutes.BRANDS}/`
  if (id !== undefined) {
    return `${route}${id}`
  }
  if (pagination) {
    return paginate(`${route}`, pagination)
  }
  return route
}

export function getPricesApiRoute(id: number) {
  return `${remote}${ApiRoutes.ARTICLES}/${id}/prices`
}

export function getListsApiRoute(params: {
  id?: number
  pagination?: PaginationParams
}) {
  const { id, pagination } = params
  const route = `${remote}${ApiRoutes.LISTS}/`
  if (id !== undefined) {
    return `${route}${id}`
  }
  if (pagination) {
    return paginate(`${route}`, pagination)
  }
  return route
}

export function getListItemsApiRoute(params: {
  listId: number
  id?: number
  pagination?: PaginationParams
}) {
  const { listId, id, pagination } = params
  const route = `${remote}${ApiRoutes.LISTS}/${listId}${ApiRoutes.ITEMS}/`
  if (id !== undefined) {
    return `${route}${id}`
  }
  if (pagination) {
    return paginate(`${route}`, pagination)
  }
  return route
}

function paginate(route: string, params: PaginationParams = undefined) {
  if (params == undefined) {
    return route
  }
  const { filter, sortBy, page, limit, asc } = params
  const searchParams = new URLSearchParams()
  if (filter) {
    searchParams.append("name", filter)
  }
  if (sortBy) {
    searchParams.append("sort_by", sortBy)
  }
  if (page > 0) {
    searchParams.append("page", `${page}`)
  }
  if (limit > 0) {
    searchParams.append("limit", `${limit}`)
  }
  if (asc !== undefined) {
    searchParams.append("asc", asc ? "1" : "0")
  }
  return `${route}?${searchParams.toString()}`
}
