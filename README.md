# User Satisfaction Dashboard

A web-based application for collecting structured feedback from students about campus services and presenting aggregated satisfaction insights to administrators through a centralized dashboard.

The system separates **feedback submission** and **feedback analysis**. Students submit feedback, while administrators analyze the collected data to support decision-making.

---

## Objective

- Collect structured feedback from students about campus services.
- Store and aggregate feedback data centrally.
- Provide administrators with clear satisfaction insights through a dashboard.

---

## System Roles

### Student

Students act as feedback providers.

Students can:
- Select a service
- Fill out a feedback form
- Submit ratings and optional comments

Students cannot:
- View analytics or dashboards
- See other students’ feedback
- Modify submitted feedback

---

### Admin

Administrators analyze feedback data through a dashboard.

Admins can:
- View aggregated satisfaction metrics
- Filter insights by service
- Review recent feedback submissions

Admins cannot:
- Submit feedback
- Edit or delete feedback

---

## Workflow

1. Student selects a service.
2. A service-specific feedback form loads.
3. Student provides ratings and optional comments.
4. Feedback is validated and stored.
5. Admin views aggregated insights through the dashboard.

---

## Supported Services

Students can submit feedback for the following campus services:

- Cafeteria
- Library
- Online Course
- Hostel
- Campus Event

Each service has predefined feedback questions.

---

## Feedback Structure

Each feedback submission contains:

### Ratings (Required)

Students rate different aspects of a service using a **1–5 scale**.

Examples include:
- Food quality
- Hygiene and cleanliness
- Staff behavior
- Resource availability
- Wi-Fi reliability
- Course content quality

These ratings form the primary analytics data.

### Optional Comment

Students can optionally provide suggestions or comments.  
Comments provide context but are not used as primary metrics.

---

## Admin Dashboard

The administrator dashboard provides insights such as:

- Total feedback count
- Average satisfaction score
- Rating distribution
- Satisfaction trends over time
- Category-level breakdowns
- Recent feedback submissions

Filters allow administrators to view data by:
- Service
- Time range

All feedback displayed in the dashboard is **read-only**.

---

## Technology Stack

Frontend and Backend

- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Recharts (charts for analytics)

Database

- MongoDB
