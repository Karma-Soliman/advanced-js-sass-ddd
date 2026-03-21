import { CourseCode, Credits } from "../value-objects"

export class Course {
  private enrolledCount: number

  constructor(
    public readonly code: CourseCode,
    public name: string,
    public credits: Credits,
    public capacity: number,
    enrolledCount: number = 0,
  ) {
    if (capacity < 1 || capacity > 200) {
      throw new Error("Capacity must be between 1 and 200")
    }

    this.enrolledCount = enrolledCount
  }
  
  static create(
    code: CourseCode,
    name: string,
    credits: Credits,
    capacity: number,
  ): Course | Error {
    if (capacity < 1 || capacity > 200) {
      return new Error("Capacity must be between 1 and 200")
    }
    if (!name.trim()) {
      return new Error("Course name cannot be empty")
    }
    return new Course(code, name, credits, capacity)
  }

  isFull(): boolean {
    return this.enrolledCount >= this.capacity
  }

  isAt80Percent(): boolean {
    return this.enrolledCount >= 0.8 * this.capacity
  }

  justCrossed80Percent(): boolean {
    const before = (this.enrolledCount - 1) / this.capacity
    const after = this.enrolledCount / this.capacity
    return before < 0.8 && after >= 0.8
  }

  enrollStudent(): void | Error {
    if (this.isFull()) {
      return new Error("Course is full")
    }
    this.enrolledCount++
  }

  unenrollStudent(): void | Error {
    if (this.enrolledCount === 0) {
      return new Error(`Course has no enrolled students to remove`)
    }
    this.enrolledCount--
  }

  getEnrolledCount(): number {
    return this.enrolledCount
  }

  getAvailableSeats(): number {
    return this.capacity - this.enrolledCount
  }

  getFillPercent(): number {
    return Math.round((this.enrolledCount / this.capacity) * 100)
  }
}