# TaskFlow – Full Stack Task Management App

TaskFlow is a full-stack web application for managing tasks.  
The project includes a React frontend and a Node.js + Express backend with MongoDB as the database.

---

## 🛠 Tech Stack

### Frontend

- React
- JavaScript
- HTML, CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB

---

## 📁 Project Structure

TaskFlow-FullStack/
├── FE/ # React frontend
├── BE/ # Node.js + Express backend
├── .gitignore
└── README.md

yaml
Copy code

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB (local or cloud – MongoDB Atlas)

---

## 🔹 Backend Setup

```bash
cd BE
npm install
npm run dev
Backend runs at:
http://localhost:5000

🔹 Frontend Setup
bash
Copy code
cd FE
npm install
npm run dev
Frontend runs at:
http://localhost:5173 (or another port)

✨ Key Features
🔐 Secure Authentication – User login and logout with JWT and email OTP verification using SendGrid

📝 Task Management – Add, edit, and delete tasks with full CRUD support

📊 Organized Workflow – Categorize tasks (Work, Home, Personal, Urgent) and filter by status (Pending, Completed)

📅 Due Date Tracking – Set due dates and automatically highlight overdue tasks

🔄 Drag & Drop Reordering – Reorder tasks easily with a drag-and-drop interface

📱 Fully Responsive – Optimized UI for both desktop (table view) and mobile (card view)

⚡ Dynamic Updates – Instant UI updates on search, filters, and task changes

📦 Modern UI – Built with Material UI for a sleek, professional look

🗂 Pagination – Manage multiple pages of tasks efficiently

yaml
Copy code
```
