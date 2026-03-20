import { Student } from "../entities/student"
import { Course } from "../entities/course"
import { Enrollment } from "../entities/Enrollment"
import {
  EnrollmentId,
  Semester
} from "../value-objects"

export class EnrollmentService {
  private enrollments: Enrollment[] = []

  enroll(
    enrollmentId: EnrollmentId,
    student: Student,
    course: Course,
    semester: Semester
  ): Enrollment {
    if (course.isFull()) {
      throw new Error("Cannot enroll: course is full")
    }

    if (!student.canEnroll(course.credits)) {
      throw new Error("Cannot enroll: student exceeds 18 credits")
    }

    const alreadyEnrolled = this.enrollments.some(
      (e) =>
        e.studentId === student.id &&
        e.courseCode === course.code &&
        e.semester === semester &&
        e.getStatus() === "active"
    )

    if (alreadyEnrolled) {
      throw new Error("Duplicate enrollment not allowed")
    }

    student.addCredits(course.credits)
    course.enrollStudent()

    const enrollment = new Enrollment(
      enrollmentId,
      student.id,
      course.code,
      semester
    )

    this.enrollments.push(enrollment)

    return enrollment
  }

  cancel(enrollment: Enrollment): void {
    enrollment.cancel()
  }
}