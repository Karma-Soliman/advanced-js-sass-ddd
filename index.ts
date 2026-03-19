import {
  createStudentId,
  createCourseCode,
  createEmail,
  createCredits,
  createSemester,
  createEnrollmentId
} from "./src/domain/value-objects"

console.log(createStudentId("STU123456"))

const result = createStudentId("BAD")
if (result instanceof Error) {
  console.log("Error:", result.message)
} else {
  console.log(result)
}

console.log(createCourseCode("CS101"))
console.log(createEmail("test@test.com"))
console.log(createCredits(3))
console.log(createSemester("Fall2024"))
console.log(createEnrollmentId("ENR001"))
