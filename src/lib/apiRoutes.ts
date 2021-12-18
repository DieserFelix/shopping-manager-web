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

export function getArticlesApiRoute(articleId: number = undefined) {
  return `${remote}${ApiRoutes.ARTICLES}${articleId ? `/${articleId}` : "/"}`
}

export function getStoresApiRoute(params: { id?: number; name?: string }) {
  const { id: id, name: name } = params
  if (id !== undefined) {
    return `${remote}${ApiRoutes.STORES}/${id}`
  } else if (name !== undefined) {
    return `${remote}${ApiRoutes.STORES}?${new URLSearchParams({
      filter: name,
    })}`
  }
  return `${remote}${ApiRoutes.STORES}/`
}

export function getCategoriesApiRoute(params: { id?: number; name?: string }) {
  const { id, name } = params
  if (id !== undefined) {
    return `${remote}${ApiRoutes.CATEGORIES}/${id}`
  } else if (name !== undefined) {
    return `${remote}${ApiRoutes.CATEGORIES}?${new URLSearchParams({
      filter: name,
    })}`
  }
  return `${remote}${ApiRoutes.CATEGORIES}/`
}
