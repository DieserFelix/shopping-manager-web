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
}
