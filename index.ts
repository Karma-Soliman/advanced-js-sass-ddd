import { Student } from "./src/domain/Entities/student"
import { Course } from "./src/domain/Entities/course"
import { EnrollmentService } from "./src/domain/service/EnrollmentService"
import { EventEmitter } from "./src/infrastructure/EventEmitter"
import {
  createStudentId,
  createCourseCode,
  createEmail,
  createCredits,
  createSemester,
  createEnrollmentId,
} from "./src/domain/value-objects"

function unwrap<T>(value: T | Error): T {
  if (value instanceof Error) throw new Error(value.message)
  return value
}

function display(value: unknown | Error): unknown {
  if (value instanceof Error) return value.message
  return value
}
// ── Setup ─────────────────────────────────────────────────────

const emitter = new EventEmitter()
emitter.subscribe((event) =>
  console.log("  EVENT:", event.type, JSON.stringify(event)),
)

const studentId = unwrap(createStudentId("STU123456"))
const email = unwrap(createEmail("john@epita.fr"))
const courseCode = unwrap(createCourseCode("CS101"))
const credits3 = unwrap(createCredits(3))
const credits6 = unwrap(createCredits(6))
const semester = unwrap(createSemester("Fall2024"))

console.log("\n=== VALUE OBJECT TESTS ===")

console.log("valid StudentId:", createStudentId("STU123456"))
console.log("invalid StudentId:", display(createStudentId("BAD")))

console.log("valid CourseCode:", createCourseCode("CS101"))
console.log("invalid CourseCode:", display(createCourseCode("INVALID")))

console.log("valid Email:", createEmail("test@test.com"))
console.log("invalid Email:", display(createEmail("wrong-email")))

console.log("valid Credits:", createCredits(3))
console.log("invalid Credits:", display(createCredits(5)))

console.log("valid Semester:", createSemester("Fall2024"))
console.log("invalid Semester:", display(createSemester("Winter2024")))

console.log("valid EnrollmentId:", createEnrollmentId("ENR-001"))
console.log("invalid EnrollmentId:", display(createEnrollmentId("123")))

// ── Scenario 1: Successful Enrollment ────────────────────────

console.log("\n=== Scenario 1: Successful Enrollment ===")
try {
  const student = new Student(studentId, "John Doe", email)
  const course = new Course(courseCode, "Programming", credits3, 5)
  const service = new EnrollmentService(emitter)

  const enrollment = service.enroll(student, course, semester)
  if (enrollment instanceof Error) throw enrollment

  console.log("Status:", enrollment.getStatus())
  console.log("Student credits:", student.getCredits())
  console.log("Course enrolled:", course.getEnrolledCount())
} catch (e) {
  console.log("Error:", (e as Error).message)
}

// ── Scenario 2: Duplicate Enrollment ─────────────────────────

console.log("\n=== Scenario 2: Duplicate Enrollment ===")
try {
  const student = new Student(studentId, "John Doe", email)
  const course = new Course(courseCode, "Programming", credits3, 5)
  const service = new EnrollmentService(emitter)

  service.enroll(student, course, semester)
  const result = service.enroll(student, course, semester)
  if (result instanceof Error) throw result
} catch (e) {
  console.log("Expected error:", (e as Error).message)
}

// ── Scenario 3: Student exceeds 18 credits ───────────────────

console.log("\n=== Scenario 3: Student Exceeds 18 Credits ===")
try {
  const student = new Student(studentId, "John Doe", email)
  const course1 = new Course(
    unwrap(createCourseCode("ENG101")),
    "English",
    credits6,
    50,
  )
  const course2 = new Course(
    unwrap(createCourseCode("PHY101")),
    "Physics",
    credits6,
    50,
  )
  const course3 = new Course(
    unwrap(createCourseCode("ART101")),
    "Art",
    unwrap(createCredits(4)),
    50,
  )
  const course4 = new Course(
    unwrap(createCourseCode("MAT101")),
    "Maths",
    credits6,
    50,
  )
  const service = new EnrollmentService(emitter)

  service.enroll(student, course1, semester) // 6
  service.enroll(student, course2, semester) // 12
  service.enroll(student, course3, semester) // 16
  console.log("Credits so far:", student.getCredits())

  const result = service.enroll(student, course4, semester) // would be 22
  if (result instanceof Error) throw result
} catch (e) {
  console.log("Expected error:", (e as Error).message)
}

// ── Scenario 4: Course becomes full ──────────────────────────

console.log("\n=== Scenario 4: Course Full ===")
try {
  const s1 = new Student(unwrap(createStudentId("STU000001")), "Alice", email)
  const s2 = new Student(unwrap(createStudentId("STU000002")), "Bob", email)
  const s3 = new Student(unwrap(createStudentId("STU000003")), "Carol", email)
  const course = new Course(courseCode, "Mini Course", credits3, 2)
  const service = new EnrollmentService(emitter)

  service.enroll(s1, course, semester)
  service.enroll(s2, course, semester)
  console.log("Course full:", course.isFull())

  const result = service.enroll(s3, course, semester)
  if (result instanceof Error) throw result
} catch (e) {
  console.log("Expected error:", (e as Error).message)
}

// ── Scenario 5: Cancel Enrollment ────────────────────────────

console.log("\n=== Scenario 5: Cancel Enrollment ===")
try {
  const student = new Student(studentId, "John Doe", email)
  const course = new Course(courseCode, "Programming", credits3, 5)
  const service = new EnrollmentService(emitter)

  const enrollment = service.enroll(student, course, semester)
  if (enrollment instanceof Error) throw enrollment

  console.log(
    "Before cancel:",
    enrollment.getStatus(),
    "| credits:",
    student.getCredits(),
  )
  service.cancel(enrollment, student, course)
  console.log(
    "After cancel:",
    enrollment.getStatus(),
    "| credits:",
    student.getCredits(),
  )

  // double cancel
  const result = service.cancel(enrollment, student, course)
  if (result instanceof Error) throw result
} catch (e) {
  console.log("Expected error:", (e as Error).message)
}
