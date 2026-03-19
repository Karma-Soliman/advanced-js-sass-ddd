import { CourseCode, Credits } from "../value-objects"

export class Course {
  private enrolledCount: number

  constructor(
    public readonly code: CourseCode,
    public name: string,
    public credits: Credits,
    public capacity: number,
    enrolledCount: number = 0
  ) {
    if (capacity < 1 || capacity > 200) {
      throw new Error("Capacity must be between 1 and 200")
    }

    this.enrolledCount = enrolledCount
  }

  isFull(): boolean {
    return this.enrolledCount >= this.capacity
  }

  isAt80Percent(): boolean {
    return this.enrolledCount >= 0.8 * this.capacity
  }

  enrollStudent(): void {
    if (this.isFull()) {
      throw new Error("Course is full")
    }
    this.enrolledCount++
  }

  getEnrolledCount(): number {
    return this.enrolledCount
  }
}