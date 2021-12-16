export const remote = "http://localhost:8000/api"

const enum ApiRoutes {
  LOGIN = "/login",
  LOGOUT = "/logout",
}

export function getLoginApiRoute() {
  return remote + ApiRoutes.LOGIN
}

export function getLogoutApiRoute() {
  return remote + ApiRoutes.LOGOUT
}
