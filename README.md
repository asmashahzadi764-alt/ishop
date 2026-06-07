<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=🛒%20iShop&fontSize=52&fontColor=fff&animation=twinkling&fontAlignY=32&desc=Full-Stack%20E-Commerce%20%2B%20Admin%20Dashboard%20System&descAlignY=55&descSize=17"/>

</div>

---

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

</div>

---

## 🌐 Live Demo

<div align="center">

| Layer | URL |
|-------|-----|
| 🖥️ **Frontend** | [https://ishop-nu.vercel.app](https://ishop-nu.vercel.app) |
| ⚙️ **Backend API** | [https://ishop-backend-a0gx.onrender.com](https://ishop-backend-a0gx.onrender.com) |

</div>

---

## 📌 Overview

**iShop** is a complete full-stack web application featuring a **modern e-commerce frontend**, a **secure admin dashboard**, and a **production-ready backend API** built with MERN-style architecture.

Users can browse products and contact the shop — while admins can manage everything through a secure dashboard with full CRUD control.

---

## ✨ Features

### 👤 User Side

| Feature | Description |
|--------|-------------|
| 🏠 Home Page | Dynamic product listing fetched from API |
| 📦 Product Categories | iPhone, iPad, MacBook & more |
| 📬 Contact Form | With validation & toast notifications |
| 🗺️ Google Maps | Embedded store location |
| 📱 Responsive UI | Works on mobile and desktop |

### 🔐 Admin Side

| Feature | Description |
|--------|-------------|
| 🔑 Secure Login | Email + password authentication (JWT) |
| ➕ Add Products | Create new products from dashboard |
| ✏️ Edit Products | Update product details |
| 🗑️ Delete Products | Remove products instantly |
| 💬 View Messages | All customer contact messages |
| 👁️ Read / Unread | Mark messages with NEW badge |
| 🔃 Sorted Messages | Latest messages shown first |
| 🗑️ Delete Messages | Clean up old messages |

### ⚙️ Backend System

| Feature | Description |
|--------|-------------|
| 🔌 REST API | Node.js + Express architecture |
| 🗄️ MongoDB | Mongoose integration |
| 🔐 JWT Auth | Secure admin authentication |
| 📦 Product CRUD | Full create, read, update, delete |
| 📬 Contact CRUD | Message management system |
| 🌐 CORS | Configured for Vercel + Render production |
| 🔒 Env Variables | Sensitive data fully protected |

---

## 🧰 Tech Stack

<table>
<tr>
<th>Frontend</th>
<th>Backend</th>
<th>Deployment</th>
</tr>
<tr>
<td>

- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Lucide Icons
- useState, useEffect

</td>
<td>

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- CORS
- dotenv

</td>
<td>

- Frontend → **Vercel**
- Backend → **Render**

</td>
</tr>
</table>

---

## 📁 Project Structure

```
iShop/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── About.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   └── App.jsx
│   │
│   ├── vite.config.js
│   └── .env
│
└── backend/
    ├── models/
    │   ├── Product.js
    │   ├── Message.js
    │   └── Admin.js
    │
    ├── routes/
    │   ├── productRoutes.js
    │   ├── contactRoutes.js
    │   └── adminRoutes.js
    │
    ├── controllers/
    │   ├── productController.js
    │   ├── contactController.js
    │   └── adminController.js
    │
    ├── server.js
    └── .env
```

---

## 📡 API Endpoints

### 🛍️ Product APIs

```http
GET    /api/products           → Get all products
POST   /api/products           → Add new product
PUT    /api/products/:id       → Update product
DELETE /api/products/:id       → Delete product
```

### 💬 Contact APIs

```http
POST   /api/contact                        → Submit contact form
GET    /api/admin/messages                 → Get all messages
PATCH  /api/admin/messages/:id/read        → Mark as read
DELETE /api/admin/messages/:id             → Delete message
```

### 🔐 Admin APIs

```http
POST   /api/admin/login        → Admin authentication
```

---

## 🔒 Environment Variables

### Frontend `.env`

```env
VITE_API_URL=https://ishop-backend-a0gx.onrender.com
```

### Backend `.env`

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

> ⚠️ Never commit `.env` files — always add them to `.gitignore`

---

## 🚀 How to Run Locally

**1. Clone the repository**
```bash
git clone https://github.com/asmashahzadi764-alt/ishop.git
cd ishop
```

**2. Start the Backend**
```bash
cd backend
npm install
npm start
```

**3. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔥 Problems Solved

- ✅ CORS error between Vercel & Render
- ✅ Localhost vs production API URL handling
- ✅ Admin authentication & JWT flow
- ✅ Full product CRUD integration
- ✅ Contact form backend connection
- ✅ Deployment configuration on both platforms

---

## 🌱 Future Improvements

| Feature | Status |
|--------|--------|
| 💳 Payment gateway (Stripe / EasyPaisa) | 📅 Planned |
| 📦 Order management system | 📅 Planned |
| 👥 User authentication system | 📅 Planned |
| 🛒 Wishlist & cart system | 📅 Planned |
| 📧 Email notifications | 📅 Planned |
| 📊 Advanced analytics dashboard | 📅 Planned |

---

## 👩‍💻 Author

<div align="center">

**Asma Shahzadi**

Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/asma-shahzadi-313291376/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/asmashahzadi764-alt)

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer&animation=twinkling"/>

</div>
