A web application for showcasing a list
of courses and their details using React, Node.

# Steps to Run:

1. Install dependencies,

```
npm i
```

2. Run the server,

```
node index.js
```

3. On another terminal, change location to frontend,

```
cd frontend
npm run start
```

# User Login Credentials

```
username:alice
password:alicepass
```

## Base URL:

The base URL for all endpoints is http://localhost:5000.

## API Authentication:

All endpoints except /login require authentication using a JSON Web Token (JWT) sent in the Authorization header.

### Endpoint 1: /course/lists

Method: GET
Description:
Retrieve a list of courses based on page number.
Parameters:

```
page (Query Parameter): Page number for pagination (e.g., /course/lists?page=1).
```

Response:
200 OK on successful retrieval.
JSON Response:

```
page: Current page number.
courses: An array of courses on the requested page.
```

### Endpoint 2: /course

Method: GET
Description: Retrieve course details by course ID.
Parameters:

```
id (Query Parameter): Course ID (e.g., /course?id=1).
```

Response:
200 OK on successful retrieval.
JSON Response:

```
course: Course details for the specified ID.
```

### Endpoint 3: /course/enroll

Method: GET
Description: Enroll a user in a course.
Parameters:

```
courseId (Query Parameter): Course ID to enroll in.
userId (Query Parameter): User ID to enroll.
```

Response:
200 OK on successful enrollment.

### Endpoint 4: /course/enrolled

Method: GET
Description: Retrieve courses in which a user is enrolled.
Parameters:

```
userId (Query Parameter): User ID for whom to retrieve enrolled courses.
```

Response:
200 OK on successful retrieval.
JSON Response:

```
courses: An array of courses in which the user is enrolled.
```

### Endpoint 5: /course/completed

Method: GET
Description: Mark a course as completed for a user.
Parameters:

```
courseId (Query Parameter): Course ID to mark as completed.
userId (Query Parameter): User ID for whom to mark the course as completed.
```

Response:
200 OK on successful course completion.

### Endpoint 6: /search

Method: GET
Description: Search for courses based on a query string.
Parameters:

```
q (Query Parameter): The search query.
```

Response:
200 OK on successful search.
JSON Response:

```
An array of courses that match the search query.
```

### Endpoint 7: /login

Method: POST
Description: User authentication and token generation.
Request Body:
JSON Object with the following fields:

```
username: User's username.
password: User's password.
```

Response:
200 OK on successful login.
JSON Response:

```
token: JWT token for authentication.
user: User details.
```

Authentication:
No authentication is required to access this endpoint.

API Authentication:
All authenticated endpoints require a valid JWT token in the Authorization header.
To obtain a token, use the /login endpoint with a valid username and password.
