# Niyo Task Manager API

This application is a backend API for a task management system.
Its functionalities include:

- User account creation
- User authentication
- Creating tasks
- Retrieving tasks
- Updating tasks
- Deleting tasks

## Database Schema

![Entity Relationship Diagram](niyo_task_manager_db.png)

```
        Entity Relationship Diagram
```

The database consists of 2 tables - _users_ and _tasks_.

The _users_ table contains columns _firstName_, _lastName_ and _emailAddress_ with _VARCHAR_ datatype with lengths of
100, 100 and 320 respectively; and _password_ in _CHAR_ datatype with a length of 64 characters as its values would be
encrypted with SHA-256 which encodes data in 64 characters. There is also an auto-incremented _id_ column which serves
as its primary key.

The _tasks_ table contains columns _title_ with a _VARCHAR_ datatype with a length of 100 characters; _description_ with
a _TEXT_ datatype; _startTime_ and _endTime_ with datatype of _DATETIME_; and _isCompleted with a datatype of _BOOLEAN_.
Just like the _users_ table, it contains an auto-incremented _id_ column which serves as its primary key. The _tasks_
table is related to the _users_ table by means of the _userID_ column with a datatype of
_INT_ which is a foreign key referencing the _id_ column on the _users_ table.

## Technologies Used

- NodeJS/Express
- Typescript
- MySQL

## Getting Started

### Prerequisites

- NodeJS
- MySQL
- XAMPP
- Postman Desktop Agent

### Installation

- Download or clone the repository
- Import the `niyo_task_manager_db.sql` file located at the root of the downloaded project
  folder on your phpMyAdmin if your local database server is within XAMPP. Otherwise, execute the content of the sql
  file
  on your MySQL server
- Navigate to the project directory on the terminal
- Run `npm install` to install the dependencies
- After the dependencies have been installed, create a `.env` file in the root directory of the project and copy the
  contents of the `.env.example` file into it. Modify some of the variable values depending on your database server
  configuration
  - PORT=8000
  - DB_HOST=localhost
  - DB_USER=root
  - DB_PASSWORD=
  - DB_NAME=niyo_task_manager_db
  - DB_PORT=3306
  - SECRET_KEY=<random_string>
  - SALT=<random_string>
- Run `npm run dev` to start the development server
- The server should be running on `http://localhost:8000`
- Launch Postman Desktop Agent to enable you test the APIs locally on Postman
- Create a collection on https://web.postman.co/ to test the various endpoints described in the next section


# API Documentation
## User Account Creation

### Request

`POST /api/users`

### Endpoint

http://localhost:8000/api/users

This endpoint allows the creation of a new user account by providing the user's first name, last name, email address and
password.

#### Request Body Parameters

- `firstName` (text, required): User's first name

- `lastName` (text, required): User's last name

- `emailAddress` (text, required): User's email address

- `password` (text, required): User's password (passwords should contain an uppercase, lowercase, and a digit. It should
  also be a minimum of 8 characters and a maximum of 20 characters)

- `passwordConfirmer` (text, required): Confirm user's password

#### Response

A successful response is a JSON object in the following form:

``` json
{
    "status": 201,
    "message": "Created",
    "data": {
        "user": {
            "id": 2,
            "firstName": "Solomon",
            "lastName": "Ukpebor",
            "emailAddress": "osas.solo@outlook.com",
            "fullName": "SOLOMON UKPEBOR"
        }
    }
}
 ```

An unsuccessful response is a JSON object in the following form:

```json
{
  "status": 401,
  "message": "Unauthorised",
  "error": {
    "firstNameError": "Sorry, first names can only contain letters and can only have a maximum of 100 characters",
    "lastNameError": "Sorry, last names can only contain letters and can only have a maximum of 100 characters",
    "emailAddressError": "Please enter a valid email address",
    "passwordError": "Sorry, passwords must contain an uppercase, lowercase and a digit. It must be a minimum of 8 characters and a maximum of 20 characters",
    "passwordConfirmerError": "Please re-enter the password you chose"
  }
}
```

## User Login

### Request

`POST /api/users/login`

### Endpoint

http://localhost:8000/api/users/login

This endpoint allows the authentication of a user using their email address and password.

#### Request Body Parameters

- `emailAddress` (text, required): User's email address

- `password` (text, required): User's password

#### Response

A successful response is a JSON object in the following form:

``` json
{
    "status": 200,
    "message": "OK",
    "data": {
        "user": {
            "id": 1,
            "firstName": "Osas",
            "lastName": "Ukpebor",
            "emailAddress": "osas.solo25@gmail.com",
            "fullName": "OSAS UKPEBOR"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsImlhdCI6MTcxNTk4MTc1NSwiZXhwIjoxNzE4NTczNzU1fQ.OdFm7Q0znOYE3oDHTU9_kSqG575Okoj-HOQnPQD9oG4"
    }
}
```

An unsuccessful response is a JSON object in the following form:

```json
{
  "status": 401,
  "message": "Unauthorised",
  "error": {
    "emailAddressError": "Sorry, this email address: osas.solo25@gmail.co could not be found",
    "passwordError": ""
  }
}
```

## Task Creation

### Request

`POST /api/users/:id/tasks`

### Endpoint

http://localhost:8000/api/users/:id/tasks

This endpoint allows the creation of a new task by providing the task's title, description, start time and end time.

#### Request Path Variables

- `id` (integer): User id gotten after account creation

#### Request Header Parameters

- `Authorization`: User token gotten after login

#### Request Body Parameters

- `title` (text, required): Task's title

- `description` (text, required): Task's description

- `startTime` (text, required): Task's start time

- `endTime` (text, required): Task's end time

#### Response

A successful response is a JSON object in the following form:

``` json
{
    "status": 201,
    "message": "Created",
    "data": {
        "task": {
            "isCompleted": false,
            "id": 5,
            "userID": 1,
            "title": "Study",
            "description": "Read CSC 111",
            "startTime": "2024-05-20 12:00:00",
            "endTime": "2024-05-20 13:00:00"
        }
    }
}
```

An unsuccessful response is a JSON object in the following forms:

```json
{
  "status": 403,
  "message": "Forbidden",
  "error": "Sorry, you do not have access to make this request"
}
```

```json
{
  "status": 401,
  "message": "Unauthorised",
  "error": {
    "titleError": "Sorry, task titles can only have a maximum of 100 characters",
    "descriptionError": "Please, describe your task",
    "startTimeError": "Sorry, time must be in the format: 2024-10-03 12:23:04 and start time must be a future time period",
    "endTimeError": "Sorry, time must be in the format: 2024-10-03 12:23:04 and times must be a future time period after start time",
    "isCompletedError": ""
  }
}
```

## Get Individual Task

### Request

`GET /api/users/:userID/tasks/:taskID`

### Endpoint

http://localhost:8000/api/users/:userID/tasks/:taskID

This endpoint allows the retrieval of a task using the id obtained during its creation.

#### Request Path Variables

- `userID` (integer): User id gotten after account creation
- `taskID` (integer): Task id gotten after task creation

#### Request Header Parameters

- `Authorization`: User token gotten after login

#### Response

A successful response is a JSON object in the following form:

``` json
{
    "status": 200,
    "message": "OK",
    "data": {
        "task": {
            "id": 5,
            "userID": 1,
            "title": "Study",
            "description": "Read CSC 111",
            "startTime": "2024-05-20T12:00:00.000Z",
            "endTime": "2024-05-20T13:00:00.000Z",
            "isCompleted": false
        }
    }
}
```

An unsuccessful response is a JSON object in the following forms:

```json
{
  "status": 403,
  "message": "Forbidden",
  "error": "Sorry, you do not have access to make this request"
}
```

```json
{
  "status": 404,
  "message": "Not found",
  "error": "Sorry, no task with id 6 could be found"
}
```

## Get All Tasks

### Request

`GET /api/users/:userID/tasks`

### Endpoint

http://localhost:8000/api/users/:userID/tasks/

This endpoint allows the retrieval of all tasks created by a user.

#### Request Path Variables

- `userID` (integer): User id gotten after account creation

#### Request Header Parameters

- `Authorization`: User token gotten after login

#### Response

A successful response is a JSON object in the following form:

``` json
{
    "status": 200,
    "message": "OK",
    "data": {
        "tasks": [
            {
                "id": 6,
                "userID": 1,
                "title": "Study",
                "description": "Read CSC 111",
                "startTime": "2024-05-20T12:00:00.000Z",
                "endTime": "2024-05-20T13:00:00.000Z",
                "isCompleted": false
            },
            {
                "id": 7,
                "userID": 1,
                "title": "Watch a Movie",
                "description": "Stream Anikulapo",
                "startTime": "2024-05-21T20:00:00.000Z",
                "endTime": "2024-05-21T23:00:00.000Z",
                "isCompleted": false
            }
        ]
    }
}
```

An unsuccessful response is a JSON object in the following forms:

```json
{
  "status": 403,
  "message": "Forbidden",
  "error": "Sorry, you do not have access to make this request"
}
```

## Task Update

### Request

`PUT /api/users/:userID/tasks/:taskID`

### Endpoint

http://localhost:8000/api/users/:userID/tasks/:taskID

This endpoint allows updating of an existing task by providing the task's title, description, start time, end time and
completion status.

#### Request Path Variables

- `userID` (integer): User id gotten after account creation
- `taskID` (integer): Task id gotten after task creation

#### Request Header Parameters

- `Authorization`: User token gotten after login

#### Request Body Parameters

- `title` (text, required): Task's title

- `description` (text, required): Task's description

- `startTime` (text, required): Task's start time

- `endTime` (text, required): Task's end time

- `isCompleted` (boolean, required): Task's completion status indicated with true or false (for the purpose of testing on
  Postman), 1 and 0 can be used as its value

#### Response

A successful response is a JSON object in the following form:

``` json
{
    "status": 200,
    "message": "OK",
    "data": {
        "task": {
            "id": 7,
            "userID": 1,
            "title": "Watch a Movie",
            "description": "Stream Anikulapo",
            "startTime": "2024-05-21 20:00:00",
            "endTime": "2024-05-21 23:00:00",
            "isCompleted": true
        }
    }
}
```

An unsuccessful response is a JSON object in the following forms:

```json
{
  "status": 403,
  "message": "Forbidden",
  "error": "Sorry, you do not have access to make this request"
}
```

```json
{
  "status": 401,
  "message": "Unauthorised",
  "error": {
    "titleError": "Sorry, task titles can only have a maximum of 100 characters",
    "descriptionError": "Please, describe your task",
    "startTimeError": "Sorry, time must be in the format: 2024-10-03 12:23:04 and start time must be a future time period",
    "endTimeError": "Sorry, time must be in the format: 2024-10-03 12:23:04 and times must be a future time period after start time",
    "isCompletedError": "Sorry, select only true or false"
  }
}
```

```json
{
  "status": 404,
  "message": "Not found",
  "error": "Sorry, no task with id 1 could be found"
}
```

## Task Delete

### Request

`DELETE /api/users/:userID/tasks/:taskID`

### Endpoint

http://localhost:8000/api/users/:userID/tasks/:taskID

This endpoint allows deleting of an existing task.

#### Request Path Variables

- `userID` (integer): User id gotten after account creation
- `taskID` (integer): Task id gotten after task creation

#### Request Header Parameters

- `Authorization`: User token gotten after login

#### Response

A successful response is an empty body with status code `204` in the following form:

``` xml

```

An unsuccessful response is a JSON object in the following forms:

```json
{
  "status": 403,
  "message": "Forbidden",
  "error": "Sorry, you do not have access to make this request"
}
```

```json
{
  "status": 404,
  "message": "Not found",
  "error": "Sorry, no task with id 1 could be found"
}
```

-----------------------------------
All requests return a response of this form when something unexpected goes wrong during processing:

```json
{
  "status": 500,
  "message": "Internal server error",
  "error": "Sorry, an error occurred while trying to signup. Please try again later."
}
```
