import { Brand } from "../types"

export type EnrollmentId = Brand<string, "EnrollmentId">

export function createEnrollmentId(value: string): EnrollmentId | Error {
  if (!value.startsWith("ENR")) {
    return new Error("Invalid EnrollmentId. Must start with ENR")
  }

  return value as EnrollmentId
}

export function generateEnrollmentId(): EnrollmentId {
  const unique =
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7)
  return `ENR-${unique}` as EnrollmentId
}