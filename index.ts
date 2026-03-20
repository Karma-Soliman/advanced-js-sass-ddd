import { Student, Course } from "./src/domain/entities"
import { EnrollmentService } from "./src/domain/service"
import {
  createStudentId,
  createCourseCode,
  createEmail,
  createCredits,
  createSemester,
  createEnrollmentId
} from "./src/domain/value-objects"

// Helper to unwrap Result
function unwrap<T>(value: T | Error): T {
  if (value instanceof Error) {
    throw new Error(value.message)
  }
  return value
}

console.log("VALUE OBJECT TESTS ")


console.log(createStudentId("STU123456"))
console.log(createCourseCode("CS101"))
console.log(createEmail("test@test.com"))
console.log(createCredits(3))
console.log(createSemester("Fall2024"))
console.log(createEnrollmentId("ENR001"))

console.log(createStudentId("BAD"))
console.log(createCourseCode("INVALID"))
console.log(createEmail("wrong-email"))
console.log(createCredits(5))
console.log(createSemester("Winter2024"))
console.log(createEnrollmentId("123"))

console.log("\n DOMAIN & BUSINESS LOGIC TESTS ")

const studentId = unwrap(createStudentId("STU123456"))
const email = unwrap(createEmail("john@epita.fr"))
const courseCode = unwrap(createCourseCode("CS101"))
const credits = unwrap(createCredits(3))
const semester = unwrap(createSemester("Fall2024"))

const student = new Student(studentId, "John Doe", email)
const course = new Course(courseCode, "Programming", credits, 2)

const service = new EnrollmentService()

console.log("\nScenario 1: Successful Enrollment ")
try {
  const enrollmentId = unwrap(createEnrollmentId("ENR001"))
  const enrollment = service.enroll(enrollmentId, student, course, semester)

  console.log("Enrollment status:", enrollment.getStatus())
  console.log("Student credits:", student.getCredits())
  console.log("Course enrolled:", course.getEnrolledCount())
} catch (e) {
  console.log("Error:", (e as Error).message)
}

console.log("\n Scenario 2: Duplicate Enrollment ")
try {
  const enrollmentId = unwrap(createEnrollmentId("ENR002"))
  service.enroll(enrollmentId, student, course, semester)
} catch (e) {
  console.log("Expected error:", (e as Error).message)
}

console.log("\n Scenario 3: Student exceeds 18 credits ")
try {
  const bigCredits = unwrap(createCredits(6))

  for (let i = 0; i < 4; i++) {
    student.addCredits(bigCredits)
  }
} catch (e) {
  console.log("Expected error:", (e as Error).message)
}

console.log("\n Scenario 4: Course becomes full ")
try {
  const smallCourse = new Course(courseCode, "Mini Course", credits, 1)
  const service2 = new EnrollmentService()

  service2.enroll(
    unwrap(createEnrollmentId("ENR003")),
    student,
    smallCourse,
    semester
  )

  console.log("First enrollment successful")

  service2.enroll(
    unwrap(createEnrollmentId("ENR004")),
    student,
    smallCourse,
    semester
  )
} catch (e) {
  console.log("Expected error:", (e as Error).message)
}

console.log("\n Scenario 5: Cancel Enrollment ")
try {
  const freshStudent = new Student(studentId, "Mark Edwards", email)

  const freshCourse = new Course(courseCode, "Programming", credits, 2)

  const freshService = new EnrollmentService()

  const enrollmentId = unwrap(createEnrollmentId("ENR005"))

  const enrollment = freshService.enroll(
    enrollmentId,
    freshStudent,
    freshCourse,
    semester
  )

  console.log("Before cancel:", enrollment.getStatus())

  freshService.cancel(enrollment)

  console.log("After cancel:", enrollment.getStatus())

} catch (e) {
  console.log("Error:", (e as Error).message)
}