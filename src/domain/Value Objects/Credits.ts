import { Brand } from "../types"

export type Credits = Brand<number, "Credits">

export function createCredits(value: number): Credits | Error {
  const allowed = [1, 2, 3, 4, 6]

  if (!allowed.includes(value)) {
    return new Error("Invalid credits value. Allowed: 1,2,3,4,6")
  }

  return value as Credits
}
