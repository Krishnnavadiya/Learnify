# Learnify - E-Learning Platform 🎓✨

Learnify is a comprehensive e-learning platform that connects students with educators, providing a seamless learning experience with course management, discussion forums, and assignment submission capabilities.

## Project Structure 🏗️

The project is divided into two main parts:

1. **Frontend**: React-based user interface 🖥️
2. **Backend**: RESTful API server ⚙️

## Frontend 🎨

### Features ✅

- User authentication (Student and Educator roles) 🔐
- User profiles and dashboard 👤
- Course browsing and enrollment 📚
- Course content organized in sections 📋
- Discussion forums for each course 💬
- Assignment submission and grading ✍️
- Responsive design for all devices 📱

### Technologies Used 💻

- React.js ⚛️
- React Router for navigation 🧭
- Material UI components 🎭
- CSS for styling 🎨
- Axios for API communication 🔄
- JWT authentication with cookies 🍪

### Setup Instructions 🚀

1. Clone the repository:
```bash
git clone https://github.com/yourusername/learnify.git
```

2. Navigate to the Frontend directory:
```bash
cd c:\Users\Admin\Downloads\Learnify\Frontend
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

5. The application will be available at `http://localhost:3000` 🌐

### Environment Variables 🔧

Create a `.env` file in the Frontend directory with the following variables:
```
REACT_APP_API_URL=http://localhost:8000
```

## Backend 🖥️

### Features ✅

- User authentication and authorization 🔐
- Course management 📚
- Content management (videos, PDFs) 📁
- Discussion forum functionality 💬
- Assignment creation and grading 📝
- Student enrollment management 👨‍👩‍👧‍👦
- User profile management 👤

### Technologies Used 💻

- Node.js 🟢
- Express.js 🚂
- MongoDB for database 🍃
- JWT for authentication 🔑
- Multer for file uploads 📤
- Bcrypt for password hashing 🔒

### Setup Instructions 🚀

1. Navigate to the Backend directory:
```bash
cd c:\Users\Admin\Downloads\Learnify\Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/learnify
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:
```bash
npm start
```

5. The API will be available at `http://localhost:8000` 🌐

## API Endpoints 🔌

### Authentication 🔐
- `POST /student/signup` - Register a new student
- `POST /student/login` - Student login
- `POST /educator/signup` - Register a new educator
- `POST /educator/login` - Educator login

### Courses 📚
- `GET /courses` - Get all courses
- `GET /courses/:id` - Get course details
- `POST /courses` - Create a new course (educator only)
- `PUT /courses/:id` - Update course (educator only)
- `DELETE /courses/:id` - Delete course (educator only)

### Discussion Forum 💬
- `GET /:usertype/:courseId/discussion` - Get all discussions for a course
- `POST /:usertype/:courseId/discussion` - Create a new discussion post

### Assignments 📝
- `GET /courses/:courseId/assignments` - Get all assignments for a course
- `POST /courses/:courseId/assignments` - Create a new assignment (educator only)
- `POST /courses/:courseId/assignments/:assignmentId/submit` - Submit an assignment (student only)
- `PUT /courses/:courseId/assignments/:assignmentId/grade` - Grade an assignment (educator only)

## How to Clone the Repository 📥

To clone this repository to your local machine, follow these steps:

1. Open your terminal or command prompt
2. Navigate to the directory where you want to store the project
3. Run the following command:
```bash
git clone https://github.com/yourusername/learnify.git
```
4. Once cloning is complete, you'll have a local copy of the repository ✅
