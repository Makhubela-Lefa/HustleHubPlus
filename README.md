# HustleHub+

HustleHub+ is a secure freelance marketplace platform that will allow
freelancers to advertise services and clients to browse and book those services.
The complete platform will also record booking-related transactions and provide
freelancers with income and estimated tax information.

This repository currently contains **Part 1: Secure Foundations**. Part 1 focuses
on the secure backend foundation that later marketplace functionality will build
on.

## Person A — Architecture & Setup

### 1. System architecture

HustleHub+ follows the MERN architectural model:

- **MongoDB** — persistent application data store used in later parts of the PoE.
- **Express.js** — backend routing and API framework.
- **React** — user-facing frontend introduced in Part 2.
- **Node.js** — JavaScript runtime for the backend API.

Part 1 does not yet require MongoDB or the React frontend to be implemented.
Instead, it establishes the Node.js/Express backend and the security foundation
required for registration and authentication. Temporary in-memory or file-based
storage may be used during this stage before the application moves to MongoDB.

See the architecture diagram in
[`docs/architecture.md`](docs/architecture.md).

The diagram separates the application into user/client, transport, backend and
data boundaries. Requests from the client are designed to reach the Express API
through HTTPS. Within the backend boundary, input validation, authentication and
controlled error handling protect processing. Passwords will be hashed before
storage and JWT will be used to identify authenticated users when protected
routes are introduced by the authentication team members.

### 2. Backend structure

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
```

The project uses separation of concerns so that routing, request handling,
models, middleware and configuration are not mixed into one file. `app.js`
configures the Express application, while `server.js` is responsible for
starting the HTTPS server. Route files define endpoint paths and delegate
processing to controllers. The remaining folders provide clear extension points
for the registration, authentication, validation and error-handling work that
will be implemented by the other group members.

### 3. HTTPS implementation and security rationale

The API is served over HTTPS using a locally generated self-signed SSL
certificate. HTTPS encrypts traffic between the client and server while data is
in transit. This is important for HustleHub+ because authentication requests may
contain credentials and later requests may contain tokens, booking information
and financial data.

The local private key and certificate files are excluded from source control.
They are generated separately on each developer machine using:

```bash
npm run cert
```

The API can then be started with:

```bash
npm start
```

By default it runs at:

```text
https://localhost:3000
```

A browser or Postman may show a warning because the development certificate is
self-signed rather than issued by a public certificate authority. This is
expected for local development.

### 4. Running the Person A foundation

1. Install Node.js if it is not already installed.
2. Clone the repository.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Run `npm run cert`.
6. Run `npm start`.
7. Open `https://localhost:3000/health`.
8. Confirm that the API returns a successful JSON response.

Expected response:

```json
{
  "success": true,
  "message": "HustleHub+ API is running over HTTPS"
}
```

## Team handover

- **Person B:** implement `POST /register`, temporary user storage and bcrypt
  password hashing.
- **Person C:** implement `POST /login`, JWT generation and JWT verification
  middleware.
- **Person D:** add comprehensive input validation, centralised error handling,
  Postman tests, demonstration evidence and final README formatting.

## Git workflow

Each group member must commit their own work regularly. Use clear, meaningful
commit messages and preserve evidence of multiple contributors throughout the
repository history.
