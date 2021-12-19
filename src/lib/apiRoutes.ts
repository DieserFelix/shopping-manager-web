export const remote = "http://localhost:8000/api"

const enum ApiRoutes {
  LOGIN = "/login",
  LOGOUT = "/logout",
  ARTICLES = "/articles",
  STORES = "/stores",
  CATEGORIES = "/categories",
}

export function getLoginApiRoute() {
  return `${remote}${ApiRoutes.LOGIN}`
}

export function getLogoutApiRoute() {
  return `${remote}${ApiRoutes.LOGOUT}`
}

export function getArticlesApiRoute(
  params: {
    id?: number
    name?: string
    store?: string
    category?: string
    sort_by?: string
    page?: number
    limit?: number
    asc?: boolean
  } = {
    id: undefined,
    name: "",
    store: "",
    category: "",
    sort_by: "name",
    page: 1,
    limit: 20,
    asc: true,
  },
) {
  const { id, name, store, category, sort_by, page, limit, asc } = params
  if (id !== undefined) {
    return `${remote}${ApiRoutes.ARTICLES}/${id}`
  } else {
    return `${remote}${ApiRoutes.ARTICLES}/?${new URLSearchParams({
      name: name ?? "",
      store: store ?? "",
      category: category ?? "",
      sort_by: sort_by ?? "updated_at",
      page: page ? `${page}` : "1",
      limit: limit ? `${limit}` : "20",
      asc: asc ? asc.toString() : "1",
    })}`
  }
}

export function getStoresApiRoute(
  params: {
    id?: number
    name?: string
    sort_by?: string
    page?: number
    limit?: number
    asc?: boolean
  } = {
    id: undefined,
    name: "",
    sort_by: "name",
    page: 1,
    limit: 20,
    asc: true,
  },
) {
  const { id, name, sort_by, page, limit, asc } = params
  if (id !== undefined) {
    return `${remote}${ApiRoutes.STORES}/${id}`
  } else {
    return `${remote}${ApiRoutes.STORES}/?${new URLSearchParams({
      name: name ?? "",
      sort_by: sort_by ?? "updated_at",
      page: page ? `${page}` : "1",
      limit: limit ? `${limit}` : "20",
      asc: asc ? asc.toString() : "1",
    })}`
  }
}

export function getCategoriesApiRoute(
  params: {
    id?: number
    name?: string
    sort_by?: string
    page?: number
    limit?: number
    asc?: boolean
  } = {
    id: undefined,
    name: undefined,
    sort_by: "name",
    page: 1,
    limit: 20,
    asc: true,
  },
) {
  console.log(params)
  const { id, name, sort_by, page, limit, asc } = params
  if (id !== undefined) {
    return `${remote}${ApiRoutes.CATEGORIES}/${id}`
  } else {
    return `${remote}${ApiRoutes.CATEGORIES}/?${new URLSearchParams({
      name: name as any,
      sort_by: sort_by ?? "updated_at",
      page: page ? `${page}` : "1",
      limit: limit ? `${limit}` : "20",
      asc: asc ? asc.toString() : "1",
    })}`
  }
}

export function getPricesApiRoute(id: number) {
  return `${remote}${ApiRoutes.ARTICLES}/${id}/prices`
}
