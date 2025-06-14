# Connect_kdth Backend

This repository contains the backend server for **Connect_kdth**, a full-stack social networking app built with Node.js and Express. It provides RESTful APIs for authentication, user management, and friend interactions.

## 📦 Tech Stack

- **Node.js**, **Express.js**
- **MongoDB** with **Mongoose**
- **JWT (JSON Web Token)** for secure authentication
- **dotenv** for environment variable management

## ⚙️ Features

- ✅ User registration and login
- ✅ JWT-based authentication middleware
- ✅ Protected user routes
- ✅ Send and accept friend requests
- ✅ MongoDB integration

## 🗂️ Project Structure

```

Connect_kdth-Backend/
├── routes/
│ ├── auth.js # Login and register routes
│ └── user.js # Friend request and user operations
├── middleware/
│ ├── auth.js # Basic token validation
│ └── authMiddleware.js # Token + user verification
├── models/
│ └── User.js # Mongoose user schema
├── .env # Environment variables
├── server.js # Entry point
```


## 🔐 API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### User

- `GET /api/user/me` — Get current user info  
- `POST /api/user/friend-request` — Send friend request  
- `POST /api/user/accept-request` — Accept friend request  
- `GET /api/user/friends` — Get friend list  

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/Nivedck/Connect-kdth-Backend.git 
   cd Connect-kdth-Backend
   ```
1. Install Dependencies:

```bash
npm Install
```

3. Configure environment variables:

    create a .env file in the root directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/connectkdth
JWT_SECRET=your_secret_key

```

4. Start the server:

```
npm run dotenv
```
## 🔗 Frontend Repo

-@Connect_kdth-Frontend

## 👤 Author
- @nivedck

## 🪪 License
- MIT License