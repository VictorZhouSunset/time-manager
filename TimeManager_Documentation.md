# Time Manager Application Documentation

## Overview
This Google Apps Script application provides a comprehensive time and project management system with a web-based interface. It allows users to create, manage, and track projects, tasks, and calendar events through a simple UI.

## Architecture
The application follows a client-server architecture:

- **Server-side**: Google Apps Script (.gs/.js files) handles data operations and API endpoints
- **Client-side**: HTML/JavaScript frontend provides the user interface

## Key Components

### Server-Side Components

#### Constants (`Constants.js`)
- **Sheet Names**: `PROJECTS_SHEET_NAME`, `TASKS_SHEET_NAME`, `EVENTS_SHEET_NAME`
- **Status Sets**: `VALID_PROJECT_STATUSES`, `VALID_TASK_STATUSES` - Define allowed status values

#### Core Services

1. **Code.js** - Main application controller
   - `doGet(e)`: Handles GET requests and renders the UI or returns data
   - `doPost(e)`: Handles POST requests for data operations
   - `include(filename)`: Helper to include HTML files

2. **ProjectService.js** - Project operations
   - `addProject(projectData)`: Creates a new project
   - `getAllProjects()`: Retrieves all projects
   - `getProjectById(projectId)`: Retrieves a specific project
   - `getProjectsByParentId(parentId)`: Gets child projects
   - `getProjectsByStatus(status)`: Filters projects by status
   - `updateProject(projectId, updateData)`: Updates a project
   - `deleteProject(projectId)`: Deletes a project with cascading deletion
   - `removeProject(projectId)`: Removes a project while preserving children
   - `removeProjectWithEvents(projectId)`: Removes a project and its events

3. **TaskService.js** - Task operations
   - `addTask(taskData)`: Creates a new task
   - `getAllTasks()`: Retrieves all tasks
   - `getTaskById(taskId)`: Retrieves a specific task
   - `getTasksByParentId(parentId)`: Gets child tasks
   - `getTasksByStatus(status)`: Filters tasks by status
   - `updateTask(taskId, updateData)`: Updates a task
   - `deleteTask(taskId)`: Deletes a task with cascading deletion
   - `removeTask(taskId)`: Removes a task while preserving children
   - `removeTaskWithEvents(taskId)`: Removes a task and its events

4. **EventService.js** - Calendar event operations
   - `addCalendarEvent(eventData)`: Creates a new calendar event
   - `getAllEvents()`: Retrieves all events
   - `getEventById(eventId)`: Retrieves a specific event
   - `getEventsByParentId(parentId)`: Gets events associated with a parent
   - `updateCalendarEvent(eventId, updateData)`: Updates an event
   - `deleteEvent(eventId)`: Deletes an event

5. **Utility Functions**
   - `getChildrenByParentId(parentId)`: Gets direct children (projects and tasks)
   - `getAllDescendantsByParentId(parentId)`: Recursively gets all descendants

6. **Testing Framework** (`CodeTests.js`)
   - Comprehensive test suite for all major functions
   - Assertion functions for validating results
   - Test data lifecycle management

### Client-Side Components

1. **Index.html** - Main application UI
   - Project creation form
   - Project listing
   - Task listing
   - Calendar event display

2. **ClientScript.html** - Client-side JavaScript
   - `updateStatus(message, isError)`: Updates status messages
   - `handleAddProject()`: Handles project creation
   - `loadProjects()`: Fetches and displays projects
   - `loadTasks(projectId)`: Fetches and displays tasks for a project
   - `loadEvents()`: Fetches and displays calendar events
   - `deleteProject(projectId)`: Handles project deletion
   - `deleteTask(taskId)`: Handles task deletion
   - `deleteEvent(eventId)`: Handles event deletion

3. **Stylesheet.html** - CSS styling for the application

## Data Model

### Project
- `projectId`: Unique identifier
- `parentId`: Optional reference to parent project/task
- `name`: Project name
- `description`: Optional description
- `status`: Current status (from predefined set)
- `expectTimeSpent`: Expected hours
- `totalTimeSpent`: Actual hours spent
- `createdAt`: Creation timestamp

### Task
- `taskId`: Unique identifier
- `parentId`: Optional reference to parent project/task
- `name`: Task name
- `description`: Optional description
- `status`: Current status (from predefined set)
- `expectTimeSpent`: Expected hours
- `totalTimeSpent`: Actual hours spent
- `createdAt`: Creation timestamp

### Calendar Event
- `eventId`: Unique identifier
- `parentId`: Optional reference to parent project/task
- `name`: Event name
- `description`: Optional description
- `eventStart`: Start date/time
- `eventEnd`: End date/time
- `createdAt`: Creation timestamp

## Key Implementation Details

1. **Hierarchical Structure**
   - Projects and tasks can have parent-child relationships
   - Circular references are prevented
   - Cascading operations (delete, get children)

2. **Error Handling**
   - Comprehensive input validation
   - Detailed error logging
   - User-friendly error messages

3. **Data Integrity**
   - Transaction-like operations for related data
   - Validation before modifications
   - Date/time consistency validation

4. **Client-Server Communication**
   - `google.script.run` for server calls from client
   - RESTful-like API endpoints in doGet/doPost
   - Consistent response format with success/error indicators

5. **Testing**
   - Unit tests for all major functions
   - Test data cleanup
   - Success/failure scenarios covered

## Workflow Examples

1. **Creating a Project**
   - User fills the project form
   - `handleAddProject()` validates and sends data
   - `doPost()` processes the request
   - `addProject()` creates the project
   - UI updates with success/error message

2. **Viewing Project Tasks**
   - User clicks "View Tasks" button
   - `loadTasks(projectId)` sends request
   - `doGet()` processes the request
   - `getAllTasks()` retrieves tasks
   - Client filters tasks by parent ID
   - UI updates with task listing

3. **Deleting a Calendar Event**
   - User clicks "Delete" on an event
   - Confirmation dialog appears
   - `deleteEvent(eventId)` sends request
   - `doPost()` processes the request
   - `deleteEvent()` removes the event
   - UI updates with status message

## Development Notes

### Environment Requirements
- Google Apps Script runtime
- Google Sheets for data storage
- Google Calendar integration for events

### Testing
Run tests using the `runAllDoGetDoPostTests()` and `runAllGetChildrenAndDescendantsTests()` functions in the script editor.

### Deployment
1. Deploy as a web app from the Apps Script editor
2. Set appropriate access permissions (user, domain, or public)
3. Access the deployed URL to use the application 