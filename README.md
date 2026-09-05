# HustleHub+

HustleHub+ is a freelance marketplace platform that we are developing using the MERN stack. The platform will allow freelancers to advertise their services and clients to browse and book those services. As the project develops, it will also record transactions and help freelancers keep track of their income and estimated tax.

We are currently working on Part 1 of the project, which focuses on setting up a secure backend before we start developing the full marketplace.

## Architecture

HustleHub+ follows the MERN architecture:

- MongoDB will be used for storing the application's data.
- Express.js is used to build the backend API.
- React will be used for the frontend in Part 2.
- Node.js is used to run the backend.

For Part 1, our main focus is Node.js and Express. We have not implemented React or MongoDB yet because these will be introduced in the later parts of the project. For now, user data can be stored temporarily using local storage such as an in-memory structure or file.

We created an architecture diagram to show how the different parts of HustleHub+ will work together and where security is applied.

[View our architecture diagram](docs/architecture.md)

The client will communicate with the backend through HTTPS. Requests will then be handled by the Express API, where validation and authentication will be applied. Passwords will be hashed using bcrypt before being stored, instead of storing the original password. When a user logs in successfully, JWT will be used to identify the authenticated user and will later be checked when protected routes are accessed.

## Project Structure

We separated the backend into different folders so that routes, application logic, security middleware, data handling, and reusable utilities are not all placed in a single file. This makes the API easier to maintain and allows security features to be applied consistently as HustleHub+ is extended in later parts.

```text
HustleHubPlus/
├── certs/
├── docs/
│   └── architecture.md
├── scripts/
│   └── generate-cert.js
├── src/
│   ├── config/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── health.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── health.routes.js
│   ├── utils/
│   │   └── jwt.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```
## Setup and Security Keys

After cloning the repository, the project dependencies can be installed using:

```bash
npm install
```

The project uses a `.env` file to store local configuration and security settings. A `.env.example` file is included in the repository as a template, so a local `.env` file should be created from this before starting the server.

The `JWT_SECRET` inside the `.env` file is used to sign and verify JWTs. It must be replaced with a long random secret of at least 32 characters. The real JWT secret should not be shared or committed to the repository. `JWT_EXPIRES_IN` controls how long the JWT remains valid.

HustleHub+ also uses a self-signed SSL certificate and private key so that the backend can run using HTTPS. The certificate and key can be generated using:

```bash
npm run cert
```

The generated files are stored inside the `certs` folder. Their locations are set in the `.env` file using `SSL_KEY_PATH` and `SSL_CERT_PATH`. Because the certificate is self-signed and is only being used for local development, Postman or a browser may show a certificate warning. SSL certificate verification can be disabled in Postman when testing the local API if required.

The server can then be started using:

```bash
npm start
```

The real `JWT_SECRET` and locally generated HTTPS certificate and private key files should not be shared or committed to the repository.


## User Registration and Password Security

HustleHub+ provides a secure user registration endpoint that allows Clients and Freelancers to create accounts. Registration requests are sent to the `/register` endpoint, where the registration controller processes the submitted user information before creating a new account.

Before a user is registered, the system checks that all required fields have been provided. It also checks whether the email address is already registered, whether the password meets the minimum length requirement, and whether the selected role is valid. Email addresses are converted to lowercase to help prevent duplicate accounts caused by differences in capitalisation.

Passwords are never stored in plain text. HustleHub+ uses bcrypt to hash each password before the user is added to temporary in-memory storage. The current implementation uses a bcrypt cost factor of 12. Bcrypt also applies a unique salt when hashing passwords, which helps protect passwords against attacks using precomputed hash values.

Only the generated password hash is stored by the application. The original password is not retained. During the login process, the password entered by the user will later be compared with the stored bcrypt hash rather than decrypting or retrieving the original password.

For Part 1, registered users are stored temporarily in an in-memory array. This means the registered users are removed when the server restarts. Persistent database storage using MongoDB will be introduced in a later part of the HustleHub+ project.

## Login and JWT Authentication

HustleHub+ allows registered users to log in through the `/login` endpoint using their email address and password. The email address is converted to lowercase before the user is searched for so that the login process remains consistent with registration.

During login, the password entered by the user is compared with the stored bcrypt `passwordHash` using `bcrypt.compare()`. The original password is never retrieved or decrypted. If the email address does not exist or the password is incorrect, the system returns the same `401 Unauthorized` response with an `Invalid credentials` message. This helps prevent the login process from revealing whether a particular email address is registered.

After the user's credentials have been successfully verified, HustleHub+ generates a JSON Web Token (JWT). The token contains the user's unique `id` and `role`, which can be used to identify the authenticated user and support role-based access control. Passwords and password hashes are not included in the token. The JWT is signed using a private `JWT_SECRET` stored in the local `.env` file, while `JWT_EXPIRES_IN` controls how long the token remains valid.

Authenticated requests send the token using the Bearer authentication format:

```http
Authorization: Bearer <token>
```

The `authenticateToken` middleware retrieves the JWT from the `Authorization` header and verifies that the token is valid and has not expired. Once the token has been verified, the user's `id` and `role` are added to `req.user` so that protected routes can identify the authenticated user.

The `/me` endpoint is protected using this middleware and demonstrates that the JWT is used after login to access protected functionality. If the token is missing, invalid, or expired, the request is rejected with a `401 Unauthorized` response. A valid token allows the request to continue and returns only the
authenticated user's safe profile information without exposing the stored password hash.

The authentication middleware is reusable so that later parts of HustleHub+ can protect gig, booking, transaction, and administrative routes without repeating the JWT verification logic.

## Input Validation

The HustleHub+ project checks the data sent to the registration and login endpoints before it is passed to the controllers. Separate validation middleware is used so that invalid or malicious input can be rejected early, avoiding problems later within the application.

The API checks that the `name`, `email`, `password`, and `role` fields have all been provided and contain string/text values. Names must be between 2 and 50 characters long after surrounding spaces are removed. Name input is also restricted to common characters used in names, such as letters, spaces, apostrophes, hyphens, and full stops. This helps reject markup and other malicious input such as `<script>` tags.

Email addresses cannot be longer than 254 characters and must match the expected email format. Registration and login also reject passwords longer than 72 bytes because bcrypt only processes passwords up to this limit.

The login endpoint checks that the `email` and `password` fields have been provided as string/text values. Registration and login also reject unexpected fields. For example, if an extra field that the endpoint does not expect is submitted, the request is rejected instead of accepting unnecessary data. When validation fails, the API returns a controlled `400 Bad Request` response with a clear message explaining the error.

## Error Handling

HustleHub+ uses centralized error-handling middleware so that errors are handled in a consistent and safe way. The API sends a simple JSON response with an appropriate HTTP status code and message. Route requests that do not exist receive a `404 Not Found` response. Invalid JSON, such as a request body with a missing closing brace, returns `400 Bad Request` instead of allowing a JSON parsing error to expose unnecessary technical information.

The JSON body is also limited to `10kb` because the registration and login endpoints only need small amounts of text data. If the limit is exceeded, the API returns a controlled `413 Payload Too Large` response. Unexpected errors from the registration, login, and protected profile controllers are passed to the central error handler using `next(error)`. The full error can still be logged in the server terminal for development and debugging, but the client only receives a general `500 Internal Server Error` message.

This means internal details such as stack traces, file paths, passwords, JWT secrets, and configuration values are not included in API error responses. Expected errors, such as invalid login details or a missing authentication token, still return their own appropriate status codes and messages.

## API Endpoints

The Part 1 backend currently provides four main endpoints:

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| `GET` | `/health` | Checks that the API is running correctly over HTTPS. | No |
| `POST` | `/register` | Creates a new Client or Freelancer account after validating the submitted data. | No |
| `POST` | `/login` | Checks the user's email and password and returns a JWT after a successful login. | No |
| `GET` | `/me` | Returns the profile information of the currently authenticated user. | Bearer JWT required |

The `/register` and `/login` endpoints are public because users need to be able to create an account and log in before they have a token. Input sent to these endpoints is checked by the validation middleware before it reaches the controllers.

The `/me` endpoint is protected. The user must include a valid JWT in the `Authorization` header using the Bearer token format. Requests with a missing, invalid, or expired token are rejected with a `401 Unauthorized` response.
