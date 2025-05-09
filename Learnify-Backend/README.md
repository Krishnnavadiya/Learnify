# Learnify Backend API

## Overview
**Learnify** is a collaborative educational platform designed for educators and students to explore, share, and organize resources aligned with the Common Core Standards. This repository houses the **Node.js backend API**, which handles all authentication, course management, certificate generation, and more.

---

## Tech Stack
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: JSON Web Token for authentication
- **bcrypt**: Password hashing
- **Multer**: File uploading
- **Nodemailer**: Email handling
- **PDFKit**: PDF generation for certificates
- **Razorpay**: Payment gateway integration

---

## Project Structure
```
Learnify-Backend/
│
├── api/
│   ├── controllers/       # Logic for routes
│   ├── middleware/        # Authentication & upload middleware
│   ├── models/            # Mongoose models
│   └── routes/            # Route definitions
│
├── uploads/               # Uploaded user files
├── utils/                 # Helper functions
├── test/                  # Test cases
├── config.env             # Environment variables
├── app.js                 # Express app setup
└── server.js              # Entry point
```

---

## Setup Instructions

### 1. Environment Configuration
Create a file named `config.env` in the root directory with the following content:

```
NODE_ENVIRONMENT = development
PORT = 8000
DATABASE = your_mongodb_connection_string
JWT_KEY = your_jwt_secret_key
JWT_EXPIRES_IN = 30d
EMAIL_HOST = your_email_host
EMAIL_PORT = your_email_port
EMAIL_USER = your_email_user
EMAIL_PASS = your_email_password
BASE_URL = https://localhost:3000/
RAZORPAY_ID_KEY = your_razorpay_id
RAZORPAY_SECRET_KEY = your_razorpay_secret
```

---

### 2. Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Krishnnavadiya/Learnify
   ```

2. **Navigate to Backend Directory**
   ```bash
   cd Learnify/Learnify-Backend
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Create Upload Directories**
   ```bash
   mkdir uploads
   ```

5. **Start the Server**
   - For development:
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

6. **Run Tests**
   ```bash
   npm test
   ```

---

## API Features

### 🔐 Authentication System
- Student & Educator registration
- Login/logout with JWT
- Password reset and profile management

### 📚 Course Management
- Educators can create/edit/delete courses
- Students can enroll/unroll, rate, and view courses

### 🧾 Content Handling
- Upload documents, videos, assignments
- Section & discussion creation

### 🏆 Certificate System
- Automatic certificate generation
- Downloadable & verifiable PDFs

### 💳 Payment Gateway
- Razorpay integration for course fees and donations

---

## API Endpoints

### 👤 Student Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/student/signup` | Register new student |
| POST | `/student/login` | Login student |
| POST | `/student/reset-password` | Request password reset |
| POST | `/student/update-password` | Update password with token |
| PATCH | `/student/edit-profile` | Update profile |
| POST | `/student/enroll/:courseId` | Enroll in course |
| POST | `/student/unroll/:courseId` | Unenroll from course |
| POST | `/student/rating/:courseId` | Rate a course |
| POST | `/student/:courseId/discussion` | Add discussion post |
| GET | `/student/:courseId/certificate` | Download certificate |

### 👩‍🏫 Educator Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/educator/signup` | Register educator |
| POST | `/educator/login` | Login educator |
| PATCH | `/educator/edit-profile` | Edit profile |
| POST | `/educator/course` | Create course |
| PATCH | `/educator/course/:courseId` | Edit course |
| DELETE | `/educator/course/:courseId` | Delete course |
| POST | `/educator/course/:courseId/section` | Add section |
| POST | `/educator/course/:courseId/assignment` | Add assignment |

### 🔎 Query Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/query/allcourse` | View all courses |
| GET | `/query/search-filter` | Search and filter |
| GET | `/query/dashboard` | Get dashboard data |
| GET | `/query/profile` | View user profile |
| GET | `/query/enrolled-course` | View enrolled courses |
| GET | `/query/recommended-course` | View suggested courses |

---

> _This README provides all essential backend documentation for developers and collaborators contributing to Learnify. For front-end documentation or deployment details, refer to the respective folders in the main repository._
