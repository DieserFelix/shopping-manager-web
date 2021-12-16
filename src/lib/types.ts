export type FetchParams = {
  url: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  body?: { [key: string]: any }
  token: string
}

export type Credentials = {
  username: string
  password: string
}

export type TokenResponse = {
  access_token: string
  token_type: string
}
export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message?: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export const enum InputTypes {
  TEXT = "text",
  PASSWORD = "password",
}

export const enum ButtonTypes {
  BUTTON = "button",
  SUBMIT = "submit",
}

export const enum ButtonContexts {
  PRIMARY = "primary",
  NEUTRAL = "neutral",
  ANCHOR = "anchor",
}
