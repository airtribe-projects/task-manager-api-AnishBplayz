# Task Manager API

A RESTful API for managing tasks built with Node.js and Express. This API provides endpoints to create, read, update, and delete tasks with support for filtering, sorting, and priority management.

## Overview

The Task Manager API is a simple yet powerful backend service for task management. It features:

- **CRUD Operations**: Create, read, update, and delete tasks
- **Filtering**: Filter tasks by completion status
- **Sorting**: Sort tasks by creation date
- **Priority Management**: Assign and filter tasks by priority levels (low, medium, high)
- **Input Validation**: Comprehensive validation for all task fields
- **Error Handling**: Proper HTTP status codes and error messages
- **REST API Versioning**: URL-based versioning (`/api/v1`) for clear versioning and future compatibility

## Features

- ✅ Full CRUD operations for tasks
- ✅ Filter tasks by completion status (`?completed=true/false`)
- ✅ Sort tasks by creation date (`?sort=createdAt` or `?sort=-createdAt`)
- ✅ Priority levels: low, medium, high
- ✅ Filter tasks by priority level
- ✅ Input validation and error handling
- ✅ Automatic timestamp tracking (createdAt)

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Comes with Node.js

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager-api-AnishBplayz
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
node app.js
```

The server will start on `http://localhost:3000`

### 4. Run Tests (Optional)

```bash
npm test
```

## API Endpoints

The API follows REST standards with **URL versioning**. All endpoints are prefixed with `/api/v1`.

### Base URL

```
http://localhost:3000/api/v1
```

### Task Schema

```json
{
	"id": 1,
	"title": "Task title",
	"description": "Task description",
	"completed": false,
	"priority": "medium",
	"createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Field Descriptions:**

- `id` (number, required): Unique identifier for the task (auto-generated)
- `title` (string, required): Task title (cannot be empty)
- `description` (string, required): Task description (cannot be empty)
- `completed` (boolean, required): Completion status
- `priority` (string, optional): Priority level - `"low"`, `"medium"`, or `"high"` (defaults to `"medium"`)
- `createdAt` (string, auto-generated): ISO 8601 timestamp of task creation

---

### 1. Get All Tasks

Retrieve all tasks with optional filtering and sorting.

**Endpoint:** `GET /api/v1/tasks`

**Query Parameters:**

- `completed` (optional): Filter by completion status (`true` or `false`)
- `sort` (optional): Sort by creation date (`createdAt` for ascending, `-createdAt` for descending)

**Response:** `200 OK`

```json
[
	{
		"id": 1,
		"title": "Set up environment",
		"description": "Install Node.js, npm, and git",
		"completed": true,
		"priority": "medium",
		"createdAt": "2024-01-15T10:30:00.000Z"
	}
]
```

**Example Requests:**

```bash
# Get all tasks
GET http://localhost:3000/api/v1/tasks

# Get only completed tasks
GET http://localhost:3000/api/v1/tasks?completed=true

# Get incomplete tasks sorted by creation date (newest first)
GET http://localhost:3000/api/v1/tasks?completed=false&sort=-createdAt
```

---

### 2. Get Task by ID

Retrieve a specific task by its ID.

**Endpoint:** `GET /api/v1/tasks/:id`

**Parameters:**

- `id` (path parameter): Task ID

**Response:** `200 OK`

```json
{
	"id": 1,
	"title": "Set up environment",
	"description": "Install Node.js, npm, and git",
	"completed": true,
	"priority": "medium",
	"createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:** `404 Not Found`

```json
{
	"error": "Task not found"
}
```

**Example Request:**

```bash
GET http://localhost:3000/api/v1/tasks/1
```

---

### 3. Get Tasks by Priority

Retrieve all tasks with a specific priority level.

**Endpoint:** `GET /api/v1/tasks/priority/:level`

**Parameters:**

- `level` (path parameter): Priority level (`low`, `medium`, or `high`)

**Response:** `200 OK`

```json
[
	{
		"id": 2,
		"title": "High priority task",
		"description": "This is important",
		"completed": false,
		"priority": "high",
		"createdAt": "2024-01-15T11:00:00.000Z"
	}
]
```

**Error Response:** `400 Bad Request`

```json
{
	"error": "Invalid priority level. Must be one of: low, medium, high"
}
```

**Example Requests:**

```bash
# Get all high priority tasks
GET http://localhost:3000/api/v1/tasks/priority/high

# Get all low priority tasks
GET http://localhost:3000/api/v1/tasks/priority/low
```

---

### 4. Create a New Task

Create a new task.

**Endpoint:** `POST /api/v1/tasks`

**Request Body:**

```json
{
	"title": "New Task",
	"description": "Task description",
	"completed": false,
	"priority": "high"
}
```

**Required Fields:**

- `title` (string): Task title
- `description` (string): Task description
- `completed` (boolean): Completion status

**Optional Fields:**

- `priority` (string): Priority level (`low`, `medium`, `high`). Defaults to `medium` if not provided.

**Response:** `201 Created`

```json
{
	"id": 16,
	"title": "New Task",
	"description": "Task description",
	"completed": false,
	"priority": "high",
	"createdAt": "2024-01-15T12:00:00.000Z"
}
```

**Error Response:** `400 Bad Request`

```json
{
	"error": "Title is required and must be a string"
}
```

**Example Request:**

```bash
POST http://localhost:3000/api/v1/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task manager API",
  "completed": false,
  "priority": "high"
}
```

---

### 5. Update a Task

Update an existing task by its ID.

**Endpoint:** `PUT /api/v1/tasks/:id`

**Parameters:**

- `id` (path parameter): Task ID

**Request Body:**

```json
{
	"title": "Updated Task",
	"description": "Updated description",
	"completed": true,
	"priority": "low"
}
```

**Response:** `200 OK`

```json
{
	"id": 1,
	"title": "Updated Task",
	"description": "Updated description",
	"completed": true,
	"priority": "low",
	"createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**

`404 Not Found` - Task doesn't exist

```json
{
	"error": "Task not found"
}
```

`400 Bad Request` - Invalid input

```json
{
	"error": "Completed is required and must be a boolean"
}
```

**Example Request:**

```bash
PUT http://localhost:3000/api/v1/tasks/1
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true,
  "priority": "high"
}
```

---

### 6. Delete a Task

Delete a task by its ID.

**Endpoint:** `DELETE /api/v1/tasks/:id`

**Parameters:**

- `id` (path parameter): Task ID

**Response:** `200 OK`

```json
{
	"id": 1,
	"title": "Deleted Task",
	"description": "This task was deleted",
	"completed": false,
	"priority": "medium",
	"createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:** `404 Not Found`

```json
{
	"error": "Task not found"
}
```

**Example Request:**

```bash
DELETE http://localhost:3000/api/v1/tasks/1
```

---

## Validation Rules

### Title

- Required: Yes
- Type: String
- Cannot be empty or whitespace-only

### Description

- Required: Yes
- Type: String
- Cannot be empty or whitespace-only

### Completed

- Required: Yes
- Type: Boolean
- Must be `true` or `false` (not string `"true"` or `"false"`)

### Priority

- Required: No (defaults to `"medium"`)
- Type: String
- Valid values: `"low"`, `"medium"`, `"high"`
- Case-insensitive

---

## Testing the API

### Using cURL

#### Get All Tasks

```bash
curl http://localhost:3000/api/v1/tasks
```

#### Get Completed Tasks

```bash
curl "http://localhost:3000/api/v1/tasks?completed=true"
```

#### Get Tasks Sorted by Creation Date (Newest First)

```bash
curl "http://localhost:3000/api/v1/tasks?sort=-createdAt"
```

#### Get Task by ID

```bash
curl http://localhost:3000/api/v1/tasks/1
```

#### Get Tasks by Priority

```bash
curl http://localhost:3000/api/v1/tasks/priority/high
```

#### Create a New Task

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "completed": false,
    "priority": "high"
  }'
```

#### Update a Task

```bash
curl -X PUT http://localhost:3000/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "description": "Updated description",
    "completed": true,
    "priority": "low"
  }'
```

#### Delete a Task

```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/1
```

### Using Postman

1. **Import Collection** (Optional):
    - Create a new collection in Postman
    - Add requests for each endpoint

2. **Set Base URL**: `http://localhost:3000/api/v1`

3. **Test Endpoints**:
    - Create a GET request to `/tasks`
    - Create a POST request to `/tasks` with JSON body
    - Create a PUT request to `/tasks/:id` with JSON body
    - Create a DELETE request to `/tasks/:id`

4. **Test Query Parameters**:
    - Add `?completed=true` to GET `/tasks`
    - Add `?sort=-createdAt` to GET `/tasks`

5. **Test Priority Endpoint**:
    - GET `/tasks/priority/high`

### Using PowerShell (Windows)

```powershell
# Get all tasks
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/tasks" | Select-Object -ExpandProperty Content

# Create a task
$body = @{
    title = "New Task"
    description = "Task description"
    completed = $false
    priority = "high"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/tasks" -Method POST -ContentType "application/json" -Body $body
```

### Running Automated Tests

```bash
npm test
```

This runs the test suite using `tap` and `supertest`, which includes tests for:

- Creating tasks
- Retrieving tasks
- Updating tasks
- Deleting tasks
- Error handling
- Input validation

---

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful GET, PUT, DELETE operations
- `201 Created`: Successful POST operation
- `400 Bad Request`: Invalid input data or validation errors
- `404 Not Found`: Resource not found (invalid task ID)

All error responses include a JSON object with an `error` field:

```json
{
	"error": "Error message description"
}
```

---

## Project Structure

```
task-manager-api-AnishBplayz/
├── app.js              # Main application file
├── task.json           # Initial task data
├── package.json        # Project dependencies and scripts
├── test/               # Test files
│   └── server.test.js  # API endpoint tests
└── README.md          # This file
```

---

## Technologies Used

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **tap**: Testing framework
- **supertest**: HTTP assertion library

---

## License

ISC

---

## Author

Airtribe
