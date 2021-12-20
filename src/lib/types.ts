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

export type Article = {
  id: number
  name: string
  detail: string
  store: string
  category: string
  brand: string
  price: Omit<Price, "created_at" | "article_id">
}

export type Price = {
  price: number
  currency: string
  created_at: string
  article_id: number
}

export type Store = {
  id: number
  name: string
}

export type Category = {
  id: number
  name: string
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
  TRANSPARENT = "transparent",
  NEUTRAL = "neutral",
  ANCHOR = "anchor",
  AUTO_COMPLETE = "autoComplete",
}
