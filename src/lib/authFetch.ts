import { ApiError, FetchParams } from "./types"

export async function authFetch<Type>(params: FetchParams) {
  const response = await fetch(params.url, {
    method: params.method,
    headers: {
      Authorization: `Bearer ${params.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: params.body ? JSON.stringify(params.body) : undefined,
  })

  if (!response.ok) {
    let message: string
    if (response.status == 422) {
      console.log(response.json())
      message = "Please fill in all required fields"
    } else {
      message = (await response.json()).detail
    }
    throw new ApiError(response.status, message)
  } else {
    if (response.status == 204) {
      return
    }
  }
  return (await response.json()) as Type
}
