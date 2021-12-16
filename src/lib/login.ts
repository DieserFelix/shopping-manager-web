import { getLoginApiRoute } from "./apiRoutes"
import type { TokenResponse } from "./types"
import { ApiError } from "./types"

export async function login(credentials: {
  username: string
  password: string
}) {
  const response = await fetch(getLoginApiRoute(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      username: credentials.username,
      password: credentials.password,
    }),
  })
  if (!response.ok) {
    let message: string
    if (response.status == 422) {
      message = "Please fill in all required fields"
    } else {
      message = (await response.json()).detail
    }
    throw new ApiError(response.status, message)
  }
  return (await response.json()) as TokenResponse
}
