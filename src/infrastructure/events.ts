import {
  EnrollmentId,
  StudentId,
  CourseCode,
  Semester,
} from "../domain/value-objects"

export type StudentEnrolled = {
  type: "StudentEnrolled"
  enrollmentId: EnrollmentId
  studentId: StudentId
  courseCode: CourseCode
  semester: Semester
}

export type EnrollementCancelled = {
  type: "EnrollementCancelled"
  enrollmentId: EnrollmentId
  studentId: StudentId
  courseCode: CourseCode
  semester: Semester
}

export type CourseCapacityReached = {
  type: "CourseCapacityReached"
  courseCode: CourseCode
  enrolled: number
  capacity: number
}

export type CourseFull = {
  type: "CourseFull"
  courseCode: CourseCode
  capacity: number
}

export type DomainEvent =
  | StudentEnrolled
  | EnrollementCancelled
  | CourseCapacityReached
  | CourseFull


export type Observer = (event: DomainEvent) => void 

export const EVENTS = {
  STUDENT_ENROLLED: "StudentEnrolled",
  ENROLLMENT_CANCELLED: "EnrollmentCancelled",
  COURSE_CAPACITY_REACHED: "CourseCapacityReached",
  COURSE_FULL: "CourseFull",
} as const
