import {
  EnrollmentId,
  StudentId,
  CourseCode,
  Semester
} from "../value-objects"

export type EnrollmentStatus = "active" | "cancelled"

export class Enrollment {
  private status: EnrollmentStatus

  constructor(
    public readonly id: EnrollmentId,
    public readonly studentId: StudentId,
    public readonly courseCode: CourseCode,
    public readonly semester: Semester,
    status: EnrollmentStatus = "active"
  ) {
    this.status = status
  }

  cancel(): void {
    if (this.status === "cancelled") {
      throw new Error("Enrollment already cancelled")
    }
    this.status = "cancelled"
  }

  isActive(): boolean {
    return this.status === "active"
  }

  getStatus(): EnrollmentStatus {
    return this.status
  }
}