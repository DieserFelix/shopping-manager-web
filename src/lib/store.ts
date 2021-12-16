import { writable } from "svelte/store"

export const authToken = writable<string>("")

export const errorMessage = writable<string>("")
