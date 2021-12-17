export const remote = "http://localhost:8000/api"

const enum ApiRoutes {
  LOGIN = "/login",
  LOGOUT = "/logout",
  ARTICLES = "/articles",
  STORES = "/stores",
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

export function getStoresApiRoute(params: {
  storeId?: number
  storeName?: string
}) {
  const { storeId, storeName } = params
  if (storeId !== undefined) {
    return `${remote}${ApiRoutes.STORES}/${params.storeId}`
  } else if (storeName !== undefined) {
    return `${remote}${ApiRoutes.STORES}?${new URLSearchParams({
      filter: params.storeName,
    })}`
  }
  return `${remote}${ApiRoutes.STORES}/`
}
