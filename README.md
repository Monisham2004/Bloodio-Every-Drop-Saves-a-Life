# Blood Donation Management System

A full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) to manage blood donations, connect donors with recipients, and allow admins to manage the platform.

## Features

- **Role-based Authentication**: Secure login and registration for Donors, Recipients, and Admins.
- **Donor Dashboard**: Toggle availability, manage profile, and accept/reject incoming blood requests.
- **Recipient Dashboard**: Search for active donors by city and blood group, send direct requests, and track request status.
- **Admin Dashboard**: View platform statistics, manage users (block/unblock/delete).
- **Notifications**: Automated email notifications using Nodemailer when requests are made or accepted.
- **Modern UI**: Fully responsive, accessible, and beautifully designed interface using Tailwind CSS and Lucide icons.

## Tech Stack

- **Frontend**: React.js (Vite), React Router DOM, Axios, Tailwind CSS, Context API.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs.
- **Other**: Nodemailer for emails.

## Setup Instructions

### 1. Prerequisites
- Node.js installed (v16+)
- MongoDB connection string (Atlas or Local)
- Gmail account with an App Password (for Nodemailer)

### 2. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the `.env` file in the `server` directory with your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   CLIENT_URL=http://localhost:5173
   ```
4. (Optional) Run the seed script to populate the database with dummy users:
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   npm start
   # or for development: npm run dev (if nodemon is installed)
   ```

### 3. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the `.env` file exists with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current logged-in user

### Donors
- `GET /api/donors/search` - Search available donors
- `PUT /api/donors/availability` - Toggle donor availability
- `PUT /api/donors/profile` - Update donor profile

### Requests
- `POST /api/requests` - Create a new blood request
- `GET /api/requests/my` - Get requests for the logged-in user
- `PUT /api/requests/:id/status` - Update request status (Accept/Reject/Complete)

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/block` - Block/unblock a user
- `DELETE /api/admin/users/:id` - Delete a user

## Deployment Guide

- **Frontend (Vercel)**:
  1. Push the `client` folder to a GitHub repository.
  2. Import the project in Vercel.
  3. Set the build command to `npm run build` and output directory to `dist`.
  4. Add the `VITE_API_URL` environment variable pointing to your deployed backend.

- **Backend (Render)**:
  1. Push the `server` folder to a GitHub repository.
  2. Create a new Web Service on Render and connect the repo.
  3. Set build command to `npm install` and start command to `node server.js`.
  4. Add all environment variables (`MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`).

- **Database (MongoDB Atlas)**:
  1. Create a free cluster on MongoDB Atlas.
  2. Whitelist all IP addresses (`0.0.0.0/0`).
  3. Get the connection string and use it in your backend `.env`.
