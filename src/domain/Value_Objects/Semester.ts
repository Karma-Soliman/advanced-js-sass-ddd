import { Brand } from "../types"

export type Semester = Brand<string, "Semester">

export function createSemester(value: string): Semester | Error {
  const regex = /^(Fall|Spring|Summer)\d{4}$/

  if (!regex.test(value)) {
    return new Error("Invalid semester format. Expected Fall|Spring|SummerYYYY")
  }

  return value as Semester
}
