> This project is currently a work in progress!
# Art Log: An Attendance and Payment Tracker for Art Classes
Art Log is a full-stack web application that efficiently manages student attendances and class payments for an art studio.

## Overview
Art Log is a project I initially took up as my IB HL CS IA, but I decided I should remake it and add many more features so that it was functional for my mom's friend's art studio business. Originally, they were using Google spreadsheets with complex formulas and some code to track all of their students' attendances, missed classes, and payment deadlines. However, they came across latency and efficiency issues, and errors would always appear from time to time. I was hoping I could fix these issues by building a web app dedicated for these needs, which is why I am **currently** building Art Log!

## Tech Stack
- Frontend: React, Vite, Typescript, TailwindCSS, ShadCN, Axios, zod
- Backend: Spring Boot, Java, REST API, gTTS4j, Spring Security, JWT Tokens
- Database: Supabase (Postgres), Flyway Migration

## Features
### Current
- **Authentication:** Users can login or sign up through email verification and OTP, and all routes are secured.
- **Attendance tracking:** Users can click the checkbox beside each student in the student table when they come for class. Automatically, their name will be displayed in the Checkout Table, and when it is their time to finish class, the frontend will call the text-to-speech (TTS) API and tell the student to "check out". This will also automatically mark students as "Attended" or "Absent" or "Makeup" for their class. Checkboxes are robust so that students who attend class on their expected days are distinguished from students who take make-up classes.
- **Editable data tables:** Users can read student and payment tables, and are also able to create new students/classes/payment tables and delete students. Student tables are filtered by day and sorted by expected class times (from AM to PM). Payment tables are sorted by the latest created, and classes are added 7 days apart (weekly classes). All payment tables can be accessed through an archive folder.
- **Navigation:** Users can access the Summary page, all the days of the week (which contains the students attending each day), and the Settings page through the sidebar.
- **Form validation:** Forms to create or delete students/payment tables are validated using zod validation schemas.
- **Time slot schedule:** Users will be able to see a visualization of how many students are expected to have class at specific time intervals (15 mins each) every day, helping admins see if the studio is full or vacant.
### Planned
- **History:** I would like users to be able to see who made changes and what those were. Version history would be my aim for this feature.
- **Easier editing:** I would like users to have an easier time to edit students/classes by double clicking, rather than clicking the triple dots.
- **Payments:** I would like users to be alerted about which students are reaching a payment deadline (or a new payment for a new set of classes).
- **Holidays:** I would like users to be able to add their own list of holidays which would automatically update all students' classes who occur on those particular days. Implementing a calendar is an option too.
