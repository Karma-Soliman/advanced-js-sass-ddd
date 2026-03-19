import { Brand } from "../types"

export type StudentId = Brand<string, "StudentId">

export function createStudentId(value: string): StudentId | Error {
  const regex = /^STU\d{6}$/

  if (!regex.test(value)) {
    return new Error("Invalid StudentId format. Expected STU followed by 6 digits")
  }

  return value as StudentId
}