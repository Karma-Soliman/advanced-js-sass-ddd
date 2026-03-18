import { Brand } from "../types"

export type Email = Brand<string, "Email">

export function createEmail(value: string): Email | Error {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!regex.test(value)) {
    return new Error("Invalid email format")
  }

  return value as Email
}