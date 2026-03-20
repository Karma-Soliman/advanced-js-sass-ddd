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

import { Student, Course, Enrollment } from "./src/domain/entities"

const studentId = createStudentId("STU123456")
const email = createEmail("test@test.com")
const courseCode = createCourseCode("CS101")
const credits = createCredits(3)
const semester = createSemester("Fall2024")
const enrollmentId = createEnrollmentId("ENR001")

if (
  studentId instanceof Error ||
  email instanceof Error ||
  courseCode instanceof Error ||
  credits instanceof Error ||
  semester instanceof Error ||
  enrollmentId instanceof Error
) {
  throw new Error("Invalid test data")
}


const student = new Student(studentId, "John Doe", email)
const course = new Course(courseCode, "Programming", credits, 2)
const enrollment = new Enrollment(enrollmentId, studentId, courseCode, semester)

student.addCredits(credits)
course.enrollStudent()

console.log("Student credits:", student.getCredits())
console.log("Course enrolled:", course.getEnrolledCount())
console.log("Enrollment status:", enrollment.getStatus())


enrollment.cancel()
console.log("Enrollment status after cancel:", enrollment.getStatus())
