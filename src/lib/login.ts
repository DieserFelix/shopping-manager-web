import { ApiError, authToken, errorMessage } from "."
import { handleErrors } from "./handleErrors"

export function login(username: string, password: string) {
  fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({ username: username, password: password }),
  })
    .then(handleErrors)
    .then((response) => response.json())
    .then((data) => authToken.set(data.access_token))
    .catch((error: ApiError) => {
      if (error.statusCode == 422) {
        errorMessage.set("Please fill in all required fields")
      } else {
        errorMessage.set(error.message)
      }
    })
}
