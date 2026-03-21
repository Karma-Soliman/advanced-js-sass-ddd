# University Enrollment System

Advanced JavaScript @ EPITA — Domain-Driven Design · Branded Types · Observer Pattern

---

## Overview

A university enrollment system built with TypeScript, applying DDD principles to model real domain logic. Students enroll in courses, credits are tracked, capacity is enforced, and domain events are emitted when meaningful things happen.

---

## File Structure

```
.
├── index.ts                          # CLI entry point
├── src/
│   ├── domain/
│   │   ├── types.ts                  # Brand<K,T> utility 
│   │   ├── value-objects/
│   │   │   ├── StudentId.ts          # STU + 6 digits
│   │   │   ├── CourseCode.ts         # 2-4 letters + 3 digits
│   │   │   ├── Email.ts              # valid email format
│   │   │   ├── Credits.ts            # only 1 | 2 | 3 | 4 | 6
│   │   │   ├── Semester.ts           # Fall|Spring|Summer + YYYY
│   │   │   ├── EnrollmentId.ts       # ENR- + unique identifier
│   │   │   └── index.ts
│   │   ├── Entities/
│   │   │   ├── student.ts            # Student entity
│   │   │   ├── course.ts             # Course entity
│   │   │   ├── Enrollment.ts         # Enrollment entity
│   │   │   └── index.ts
│   │   └── service/
│   │       ├── EnrollmentService.ts  # Business rules + event emission
│   │       └── index.ts
│   └── infrastructure/
│       ├── events.ts                 # DomainEvent union + Observer type
│       └── EventEmitter.ts           # subscribe / unsubscribe / emit
├── tsconfig.json
└── package.json
```

---

## Concepts

### Branded Types

TypeScript's type system treats `string` and `number` as interchangeable in many cases. Branded types make them distinct so you can't accidentally pass a raw string where a `StudentId` is expected.

```typescript
type Brand<K, T> = K & { __brand: T }

type StudentId = Brand<string, "StudentId">
type Email     = Brand<string, "Email">
// Both are strings at runtime, but TypeScript treats them as different types
```

Each branded type has a **smart constructor** that validates the value before branding it:

```typescript
function createStudentId(value: string): StudentId | Error {
  if (!/^STU\d{6}$/.test(value)) {
    return new Error("Invalid StudentId format")
  }
  return value as StudentId
}
```

If validation fails it returns an `Error` — it never throws. The caller decides what to do with it.

---

### Domain-Driven Design (DDD)

The code is organized around the domain — the real-world problem being solved — not around technical concerns.

**Value Objects** are immutable, validated wrappers around primitives. They have no identity — two `Email` values with the same address are equal.

**Entities** are objects with identity that change over time. A `Student` has an id, a name, and a credit count that grows as they enroll.

**Domain Service** (`EnrollmentService`) handles logic that doesn't naturally belong to a single entity — like checking a student's credits *and* a course's capacity *and* duplicate enrollments all at once before allowing an enroll.

**Invariants** are rules that must always hold. The system enforces them at the boundary — before any mutation happens:
- A student can't exceed 18 credits
- A course can't exceed its capacity
- No duplicate active enrollments

---

### Observer Pattern

The `EventEmitter` lets any part of the system subscribe to domain events without the service needing to know who's listening.

```typescript
// All domain events in one union
type DomainEvent =
  | StudentEnrolled
  | EnrollmentCancelled
  | CourseCapacityReached
  | CourseFull

type Observer = (event: DomainEvent) => void
```

```typescript
emitter.subscribe((event) => {
  switch (event.type) {
    case "StudentEnrolled":        // handle ...
    case "EnrollmentCancelled":    // handle ...
    case "CourseCapacityReached":  // handle ...
    case "CourseFull":             // handle ...
  }
})
```

The `switch` on `event.type` is a **discriminated union** — TypeScript automatically narrows the type in each case block, so you get full type safety without any casting.

---

## How to Run

```bash
npm install
npm run dev
```
