# 🚀 TaskFlow -- MERN Task Manager App

TaskFlow is a full-stack task management application built using the
MERN stack.\
It helps users manage daily tasks with secure authentication and OTP
verification.

---

## ✨ Features

🔐 Secure Authentication – User login and logout with JWT and email OTP verification using SendGrid

📝 Task Management – Add, edit, and delete tasks with full CRUD support

📊 Organized Workflow – Categorize tasks (Work, Home, Personal, Urgent) and filter by status (Pending, Completed)

📅 Due Date Tracking – Set due dates and automatically highlight overdue tasks

🔄 Drag & Drop Reordering – Reorder tasks easily with a drag-and-drop interface

📱 Fully Responsive – Optimized UI for both desktop (table view) and mobile (card view)

⚡ Dynamic Updates – Instant UI updates on search, filters, and task changes

📦 Modern UI – Built with Material UI for a sleek, professional look

🗂 Pagination – Manage multiple pages of tasks efficiently

---

## 🛠 Tech Stack

**Frontend**

- React.js
- Redux Toolkit
- Material UI
- Axios

**Backend**

- Node.js
- Express.js
- MongoDB
- JWT Authentication -SendGrid (Email OTP)

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB (local or cloud – MongoDB Atlas)

---

### 2. Install dependencies

Backend:

```bash
cd BE
npm install
```

Frontend:

```bash
cd FE
npm install
```

---

## 🔐 Environment Variables

Create `.env` in **BE** folder:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
SENDGRID_API_KEY=your_key
```

---

## ▶️ Run Locally

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
```

---

## 👨‍💻 Author

**Noman**\
Web Developer

- GitHub: https://github.com/NomanAdam\
- LinkedIn: www.linkedin.com/in/noman-ghaffar-378741270

---

## ⭐ Support

If you like this project, give it a star ⭐
