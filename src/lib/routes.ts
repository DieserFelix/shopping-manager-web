export const enum Routes {
  LOGIN = "/",
  DASHBOARD = "/dashboard",
  LISTS = "/dashboard/lists",
  ARTICLES = "/dashboard/articles",
}

export function getListRoute(id: number) {
  return `${Routes.LISTS}/${id}`
}
