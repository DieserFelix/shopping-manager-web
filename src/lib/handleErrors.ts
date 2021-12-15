import { ApiError } from "."

export async function handleErrors(response: Response) {
  if (!response.ok) {
    throw new ApiError(response.status, (await response.json()).detail)
  }
  return response
}
