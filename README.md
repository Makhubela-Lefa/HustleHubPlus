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

We separated the backend into different folders so that all the code is not placed in one file.

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
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── health.routes.js
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md

## User Registration and Password Security

HustleHub+ provides a secure user registration endpoint that allows Clients
and Freelancers to create accounts. Registration requests are sent to the
`/register` endpoint, where the registration controller processes the
submitted user information before creating a new account.

Before a user is registered, the system checks that all required fields have
been provided. It also checks whether the email address is already registered,
whether the password meets the minimum length requirement, and whether the
selected role is valid. Email addresses are converted to lowercase to help
prevent duplicate accounts caused by differences in capitalisation.

Passwords are never stored in plain text. HustleHub+ uses bcrypt to hash each
password before the user is added to temporary in-memory storage. The current
implementation uses a bcrypt cost factor of 12. Bcrypt also applies a unique
salt when hashing passwords, which helps protect passwords against attacks
using precomputed hash values.

Only the generated password hash is stored by the application. The original
password is not retained. During the login process, the password entered by
the user will later be compared with the stored bcrypt hash rather than
decrypting or retrieving the original password.

For Part 1, registered users are stored temporarily in an in-memory array.
This means the registered users are removed when the server restarts.
Persistent database storage using MongoDB will be introduced in a later part
of the HustleHub+ project.