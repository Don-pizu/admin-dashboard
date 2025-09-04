#  Admin Dashboard API

## Description
The **Admin Dashboard API** is a secure and scalable backend service designed to power admin panels.  
It implements **role-based access control (RBAC)**, enabling different levels of permissions for admins, managers, and regular users.  
This project is ideal for applications that require fine-grained access management and a structured approach to user authorization.

## Features
- Authentication & Authorization using JWT
- User management (create, update, delete users)
- Role-based access control (RBAC)*
- Protected routes for admins, managers and users
- Scalable RESTful API design
- Environment configuration with `.env`

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
├── controllers/
├── models/
├── routes/ 
├── middleware/
├── config/
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
-Jest
-Swagger


## Author name

-Asiru Adedolapo

## Stage, Commit, and Push**

``bash
git add .
git commit -m "feat: initial project setup with folder structure and README"
git branch -M main
git remote add origin https://github.com/Don-pizu/admin-dashboard.git
git push -u origin main

