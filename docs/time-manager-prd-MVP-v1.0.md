# Personal Time and Project Management Tool - Requirements Document (MVP v1.0)

**Version:** 1.0 (MVP)
**Date:** May 1, 2025

## 1. Introduction and Goals

* **Goal:** To build a Minimum Viable Product (MVP) of a basic personal time and project management tool. This MVP aims to allow users to create and manage basic projects and tasks, and record time spent on tasks. Its main purpose is to validate core functionality, gather early feedback, and lay the foundation for future product iterations.
* **Project Background:** This is a personal learning and practice project aimed at enhancing relevant technical skills. The final code will be hosted on GitHub for demonstration purposes.

## 2. Scope (MVP v1.0)

### 2.1 In Scope Features

* **Project Management:**
    * Create new projects (including name, description, and associating with a parent).
    * View the project list.
    * View the list of direct children (sub-projects/tasks) of a project.
    * Edit existing project information (name, description, status, parent relationship, time spent).
    * Delete projects (including their children and associated calendar events).
* **Task Management:**
    * Create new tasks (including name, description, and associating with a parent).
    * View the task list.
    * View the list of direct children (sub-tasks) of a task.
    * Edit existing task information (name, description, status, parent relationship, time spent).
    * Delete tasks (including their children and associated calendar events).
* **Calendar Event Management:**
    * Create calendar events (including name, description, start/end times, and optional association with a task or project).
    * View the calendar event list.
    * Edit existing calendar events (name, description, start/end times, parent association).
    * Delete calendar events.
* **Basic Views:**
    * Provide a clear hierarchical list view for projects/tasks.
* **Core Data Model:** Implement the basic data structures for Projects, Tasks, and Calendar Events.

### 2.2 Out of Scope Features (for MVP)

* **Advanced Project/Task Attributes:**
    * Complex priority system (e.g., High/Medium-High/Medium-Low/Low).
    * Color coding.
    * Start dates, end dates, deadlines (ddl) for projects/tasks.
* **Complex Logic and Automation:**
    * Automatic calculation of project/task status based on estimated/spent time and warnings.
    * Progress update Notes feature.
* **Hierarchy and Recurrence:**
    * Complex hierarchical structures (e.g., Sections/Areas, Sub-projects, Sub-tasks beyond direct parent-child).
    * Recurring tasks feature.
    * "Non-task type" items and their related logic.
* **Views and Integration:**
    * Calendar view integration.
* **AI Features:**
    * Any AI-related features (e.g., automatic time scheduling).

*Note: All "Out of Scope Features" are potential features for future versions.*

## 3. Core Data Model (MVP v1.0)

### 3.1 Project

| Field Name        | Data Type | Required | Description                                      | Example                 |
| :---------------- | :-------- | :------- | :----------------------------------------------- | :---------------------- |
| `projectId`       | String    | Yes      | Unique identifier (system generated)             | `"P-12345"`             |
| `parentId`        | String    | No       | ID of the parent project/task (if any)           | `"P-00000"` or `null`   |
| `name`            | String    | Yes      | Title of the project                             | `"Develop Mgmt Tool"`   |
| `description`     | String    | No       | Brief description of the project (defaults empty)| `"Personal learning project"`|
| `status`          | String    | Yes      | Project status: "Not yet started", "Ahead of schedule", "On track", "Behind schedule", "Stuck", "Paused", "Completed" | `"On Track"`         |
| `expectTimeSpent` | Number    | Yes      | Estimated time required for the project (hours)  | `7`                     |
| `totalTimeSpent`  | Number    | No       | Accumulated time spent on the project (hours, defaults 0) | `1.5`                   |
| `createdAt`       | DateTime  | Yes      | Timestamp of creation (auto-generated)           | `"2025-05-01T10:00:00Z"`|

### 3.2 Task

| Field Name        | Data Type | Required | Description                                      | Example                 |
| :---------------- | :-------- | :------- | :----------------------------------------------- | :---------------------- |
| `taskId`          | String    | Yes      | Unique identifier (system generated)             | `"T-67890"`             |
| `parentId`        | String    | Yes      | ID of the parent project/task                    | `"P-12345"`             |
| `name`            | String    | Yes      | Title of the task                                | `"Design Database"`     |
| `description`     | String    | No       | Brief description of the task (defaults empty)   | `"Design Sheet structure"`|
| `status`          | String    | Yes      | Task status: "Not yet started", "Ahead of schedule", "On track", "Behind schedule", "Stuck", "Paused", "Completed" | `"Not yet started"`                |
| `expectTimeSpent` | Number    | Yes      | Estimated time required for the task (hours)     | `1.5`                   |
| `totalTimeSpent`  | Number    | No       | Accumulated time spent on the task (hours, defaults 0) | `0`                     |
| `createdAt`       | DateTime  | Yes      | Timestamp of creation (auto-generated)           | `"2025-05-01T10:05:00Z"`|

### 3.3 Calendar Event

| Field Name    | Data Type | Required | Description                                      | Example                 |
| :------------ | :-------- | :------- | :----------------------------------------------- | :---------------------- |
| `eventId`     | String    | Yes      | Unique identifier (system generated)             | `"CE-17435"`            |
| `parentId`    | String    | No       | ID of the parent project/task (if any)           | `"T-67890"` or `null`   |
| `name`        | String    | Yes      | Title of the calendar event                      | `"Jogging"`             |
| `description` | String    | No       | Brief description of the event (defaults empty)  | `"Go to the gym"`       |
| `eventStart`  | DateTime  | Yes      | Start time of the event                          | `"2025-05-04T09:30:00Z"`|
| `eventEnd`    | DateTime  | Yes      | End time of the event                            | `"2025-05-04T11:30:00Z"`|
| `createdAt`   | DateTime  | Yes      | Timestamp of creation (auto-generated)           | `"2025-05-01T11:30:00Z"`|

## 4. Functional Requirements (MVP v1.0) - Updated

### 4.1 Project Management (CRUD - Hierarchy Supported)

* **Create:**
    * User should be able to create a new project via the interface by entering `name`, optional `description`, and optionally specifying a `parentId` (selecting an existing project as parent).
    * User should be able to set the initial `status` (from "Not yet started", "Ahead of schedule", "On track", "Behind schedule", "Stuck", "Paused", "Completed").
    * User should be able to input `expectTimeSpent` (estimated hours).
    * System automatically generates `projectId`, sets `totalTimeSpent` to 0, and records `createdAt`.
* **Read:**
    * User should be able to view a project list that clearly displays hierarchical relationships (e.g., via indentation or a tree structure). Should be easy to view top-level projects (those without a `parentId`).
    * The list should display at least the project `name` and `status`.
    * User should be able to click on a project to view its details (including `description`, `status`, `expectTimeSpent`, `totalTimeSpent`) and the list of its direct child projects and tasks.
* **Update:**
    * User should be able to modify an existing project's `name`, `description`, `status` (selected from the list), and `expectTimeSpent`.
    * User should be able to modify the project's parent relationship (change `parentId`, or set/unset `parentId`). Must prevent setting a project as its own descendant.
    * **User should be able to manually update the project's `totalTimeSpent` field (inputting the new cumulative time spent).**
* **Delete:**
    * User should be able to delete a project.
    * When deleting a project, options or clear rules should be provided for handling its child projects and tasks：there will be two functions, one allowing only deleting the current project (and deleting the parentID of its children while leaving the children itself untouched), one cascade deleting where all children of the current project are deleted too. Associated `CalendarEvent`s must also be deleted.

### 4.2 Task Management (CRUD - Hierarchy Supported)

* **Create:**
    * When viewing a project or task, the user should be able to create a new task. Requires inputting task `name`, optional `description`.
    * User should be able to set the initial `status` (from "Not yet started", "Ahead of schedule", "On track", "Behind schedule", "Stuck", "Paused", "Completed").
    * User should be able to input `expectTimeSpent` (estimated hours).
    * System automatically generates `taskId`, sets `totalTimeSpent` to 0, and records `createdAt`.
* **Read:**
    * In the project/task detail view, the user should be able to see the list of direct child tasks.
    * The task list should display at least the task `name`, `status`, `expectTimeSpent`, and `totalTimeSpent`.
    * A way should be provided to view a list of all tasks (possibly grouped by project/parent task).
* **Update:**
    * User should be able to modify an existing task's `name`, `description`, `status` (selected from the list), and `expectTimeSpent`.
    * User should be able to modify the task's parent relationship (change `parentId`). Must prevent setting a task as its own descendant.
    * **User should be able to manually update the task's `totalTimeSpent` field (inputting the new cumulative time spent).**
* **Delete:**
    * User should be able to delete a task.
    * When deleting a task, options or clear rules should be provided for handling its child projects and tasks：there will be two functions, one allowing only deleting the current task (and deleting the parentID of its children while leaving the children itself untouched), one cascade deleting where all children of the current task are deleted too. Associated `CalendarEvent`s must also be deleted.

### 4.3 Calendar Event Management (CRUD)

* **Create:**
    * User should be able to create a new calendar event.
    * Requires inputting event `name`, `eventStart` (DateTime), `eventEnd` (DateTime).
    * Optional input for `description`.
    * Optionally specify a `parentId` (linking to a project or task).
    * System automatically generates `eventId` and records `createdAt`.
* **Read:**
    * User should be able to view a list of all calendar events (sorted by date/time).
    * User should be able to view a list of events starting on a specific day (sorted by date/time).
    * The list should display at least the event `name`, `eventStart`, `eventEnd`, and the name of the associated parent project/task (if any).
* **Update:**
    * User should be able to modify an existing calendar event's `name`, `description`, `eventStart`, `eventEnd`, and `parentId`.
* **Delete:**
    * User should be able to delete a calendar event.

## 5. (Optional) Non-Functional Requirements (MVP v1.0)

* **Usability:** The interface should be simple and intuitive. Core operations (creating projects/tasks, recording time, viewing lists) should be easy for the user to understand and perform.
* **Data Consistency:** Ensure accuracy and consistency of data operations (especially deletions and time updates for parent/child relationships).
* **Responsiveness:** Basic interface interactions should have reasonable response times.

