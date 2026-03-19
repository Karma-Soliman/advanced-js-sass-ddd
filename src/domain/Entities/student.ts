import { StudentId, Email, Credits } from "../value-objects"

export class Student {
  private enrolledCredits: number

  constructor(
    public readonly id: StudentId,
    public name: string,
    public email: Email,
    enrolledCredits: number = 0
  ) {
    this.enrolledCredits = enrolledCredits
  }

  canEnroll(credits: Credits): boolean {
    return this.enrolledCredits + credits <= 18
  }

  addCredits(credits: Credits): void {
    if (!this.canEnroll(credits)) {
      throw new Error("Credit limit exceeded (max 18)")
    }
    this.enrolledCredits += credits
  }

  getCredits(): number {
    return this.enrolledCredits
  }
}

