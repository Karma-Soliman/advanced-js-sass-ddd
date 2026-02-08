# Project Specification: University Enrollment System

**Document ID:** ACAD-REG-2026 Author: Dr. Helena V., Dean of Studies Target Audience: Engineering Team Subject: Rules and Regulations for the New Course Registration Module

## 1. Executive Summary

We are replacing our legacy paper-based system with a digital enrollment platform. The goal is to allow students to self-register for courses while strictly enforcing our academic standards. We cannot afford any more "overbooking" errors or students graduating without the correct prerequisites.

## 2. The Ubiquitous Language (Glossary)

Please ensure these terms are used consistently in the software to avoid confusion between the administration and the developers.

- Student: An individual currently strictly registered at the university. (Must have a valid university email).
- Course: A specific subject offered during a semester (e.g., "Advanced JS").
- Credit: The unit of value for a course. A standard course is usually 2 to 6 credits.
- Cohort: A group of students (e.g., "Class of 2026").
- Enrollment: The successful association of a Student with a Course.
- Academic Load: The total sum of credits a student is taking at once.

## 3. Business Rules & Policies

### 3.1. Identity Verification

We have had issues with students using personal Gmail accounts.

- Rule: A student is only valid if they possess a specific university email address ending in @epita.fr.
- Rule: A student ID must be present and follow the format STU- followed by 6 digits.

### 3.2. The "Academic Load" Safety Limit

To prevent student burnout, we strictly limit how much work they can take on.

- Rule: A student cannot have a negative number of credits (obviously, but the old system had a bug here).
- Rule: The Maximum Academic Load is 30 Credits.
- Rule: If a student tries to register for a course that pushes their total load over 30 credits, the registration must be rejected immediately.

### 3.3. Course Capacity (The "Fire Marshal" Rule)

Our classrooms have physical limits.

- Rule: Every course has a defined Capacity (usually 20 or 40 seats).
- Rule: Under no circumstances can the number of enrolled students exceed the Capacity.
- Rule: Race conditions (two students clicking "Join" at the exact same millisecond) are not an excuse. If there is 1 seat left, only 1 student gets in.

### 3.4. Prerequisites

- Rule: Some courses require a foundation. If "Advanced JavaScript" requires "Intro to Algorithms," the system must check the student's history.
- Rule: If the prerequisite is missing, the enrollment is "Invalid."

## 4. Use Case: "Registering for a Course"

When a student attempts to register, the system must perform the following flow:

1. Validate the Student: Ensure the student account is active and valid.
2. Check Availability: Ensure the Course is not full.
3. Check Constraints: Ensure the new course does not violate the "Maximum Academic Load" and that Prerequisites are met.
4. Process Enrollment:
   - Deduct the seat from the Course availability.
   - Add the credits to the Student's load.
   - **Notification:** The system must trigger a confirmation email to the student AND notify the "Academic Board" (a log or admin console) that a registration occurred.

## 5. Technical Stack Requirements (Added by CTO)

The engineering team has decided on the following stack to ensure type safety and data integrity:

- Runtime: Node.js (LTS Version)
- Language: TypeScript (Strict Mode enabled)
- Database: SQLite (using better-sqlite3 or prisma implies local file storage for simplicity).
- Architecture Style: Modular Monolith (Domain-Driven Design).


### Technical Constraints

- No "Anemic" Models: Do not create Student classes that are just empty data containers. The logic for "Can I enroll?" belongs inside the Domain, not in the Controller.
- Value Objects: Concepts like Email, Credits, and CourseID must not be treated as primitive strings or numbers. They must be Value Objects.
- Persistence Ignorance: The Domain logic should not know it is being saved to SQLite. Use Repositories.