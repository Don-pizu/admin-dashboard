#  Admin Dashboard API

## Description
The **Admin Dashboard RBAC API** is a secure and scalable backend service designed to power admin panels.  
It implements **role-based access control (RBAC)**, enabling different levels of permissions for admins, managers, and regular users.  
This project is ideal for applications that require fine-grained access management and a structured approach to user authorization.

## Features
- Authentication & Authorization using JWT
- User management (create, update, delete users)
- Role-based access control (RBAC)*
- Protected routes for admins, managers and users
- Scalable RESTful API design
- Environment configuration with `.env`
- HTTP-only cookies for refresh tokens

## User Management
- Signup & Login with JWT authentication

- Role-based access control (default role = user)

- Logout (invalidate refresh token in DB)

- LogActivity for auditing:

				login_success

				login_failed

				logout

				role_change


## Installation & Usage

``bash
# Clone the repository
git clone https://github.com/Don-pizu/admin-dashboard.git

# Navigate into the project folder
cd admin-dashboard

# Install dependencies
npm install

# Start the server
node server.js

project-root/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── logsController.js
│   ├── statsController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── roleMiddleware.js
├── models/
│   ├── User.js
│   ├── refreshToken.js
│   └── logActivity.js
├── routes/
│   ├── authRoutes.js
│   ├── logsRoutes.js
│   ├── statsRoutes.js
│   └── userRoutes.js
├── utils/
│   └── loggerActivity.js
├── tests/
├── server.js
├── .env
├── .gitignore
└── README.md




## Technologies used
-Node.js
-Express.js
-MongoDB
-JWT Authentication
-Bcrypt.js (password hashing)
-dotenv (environment variables)
-Helmet, Express-rate-limit, Mongo-sanitize, XSS-clean


## Auth Routes (/api/auth)

| Method | Endpoint   | Description                               |
| ------ | ---------- | ----------------------------------------- |
| POST   | `/signup`  | Register a new user (default role = user) |
| POST   | `/login`   | Login user & issue access + refresh token |
| POST   | `/refresh` | Get new access token using refresh token  |
| POST   | `/logout`  | Logout user and invalidate refresh token  |



## User Routes (/api)

| Method | Endpoint     | Access                        | Description    |
| ------ | ------------ | ----------------------------- | -------------- |
| GET    | `/users`     | Admin                         | Get all users  |
| GET    | `/users/:id` | Admin / Manager / User (self) | Get user by ID |
| PUT    | `/users/:id` | Admin / Manager / User (self) | Update user    |
| DELETE | `/users/:id` | Admin                         | Delete user    |



## Log Routes (/api)

| Method | Endpoint    | Access          | Description                |
| ------ | ----------- | --------------- | -------------------------- |
| GET    | `/logs`     | Admin           | Get all logs               |
| DELETE | `/logs/:id` | Admin           | Delete log by ID           |
| DELETE | `/logs`     | Admin           | Delete all logs            |
| GET    | `/export`   | Admin / Manager | Export logs (with filters) |


## Stats Routes (/api/stats)

| Method | Endpoint        | Access          | Description                   |
| ------ | --------------- | --------------- | ----------------------------- |
| GET    | `/users`        | Admin / Manager | Count users by role           |
| GET    | `/logins`       | Admin / Manager | Count login success vs failed |
| GET    | `/active-users` | Admin / Manager | Users active in last 24 hours |








## Author name

-Asiru Adedolapo

## Stage, Commit, and Push**

``bash
git add .
git commit -m "feat: initial project setup with folder structure and README"
git branch -M main
git remote add origin https://github.com/Don-pizu/admin-dashboard.git
git push -u origin main

