import { Student } from "../entities/student"
import { Course } from "../entities/course"
import { Enrollment } from "../entities/Enrollment"
import {
  EnrollmentId,
  generateEnrollmentId,
  Semester
} from "../value-objects"
import { EventEmitter } from "../../infrastructure/eventEmitter"

export class EnrollmentService {
  private enrollments: Enrollment[] = []

  constructor(private readonly emitter: EventEmitter) {}

  enroll(
    enrollmentId: EnrollmentId,
    student: Student,
    course: Course,
    semester: Semester,
  ): Enrollment | Error {
    if (course.isFull()) {
      return new Error("Cannot enroll: course is full")
    }

    if (!student.canEnroll(course.credits)) {
      return new Error("Cannot enroll: student exceeds 18 credits")
    }

    const alreadyEnrolled = this.enrollments.some(
      (e) =>
        e.studentId === student.id &&
        e.courseCode === course.code &&
        e.semester === semester &&
        e.isActive(),
    )

    if (alreadyEnrolled) {
      return new Error("Duplicate enrollment not allowed")
    }

    student.addCredits(course.credits)
    course.enrollStudent()

    const enrollment = new Enrollment(
      generateEnrollmentId(),
      student.id,
      course.code,
      semester,
    )

    this.enrollments.push(enrollment)

    this.emitter.emit({
      type: "StudentEnrolled",
      enrollmentId: enrollment.id,
      studentId: student.id,
      courseCode: course.code,
      semester,
    })

    if (course.justCrossed80Percent()) {
      this.emitter.emit({
        type: "CourseCapacityReached",
        courseCode: course.code,
        enrolled: course.getEnrolledCount(),
        capacity: course.capacity,
      })
    }

    if (course.isFull()) {
      this.emitter.emit({
        type: "CourseFull",
        courseCode: course.code,
        capacity: course.capacity,
      })
    }

    return enrollment
  }

  cancel(enrollment: Enrollment, student: Student, course: Course): void | Error {
    student.removeCredits(course.credits)
    course.unenrollStudent()

    this.emitter.emit({
      type: "EnrollementCancelled",
      enrollmentId: enrollment.id,
      studentId: enrollment.studentId,
      courseCode: enrollment.courseCode,
      semester: enrollment.semester,
    })
  }
}