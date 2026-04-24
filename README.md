# 🌟 Fash-Shop | Premium MERN E-Commerce

Fash-Shop is a sophisticated, full-stack e-commerce platform designed for the modern fashion era. Built with the **MERN Stack (MongoDB, Express, React, Node.js)**, it offers a seamless shopping experience for customers and a robust management system for administrators.


## 🚀 Experience the Live Demo
**Frontend:** [fash-shop.onrender.com](https://fash-shop.onrender.com/)

---

## ✨ Features

### 🛍️ For Customers
- **Fluid Shopping Experience:** Modern, responsive UI tailored for all devices.
- **Advanced Product Filtering:** Sort by category, sub-category, and price.
- **Dynamic Cart System:** Real-time updates with size selection and quantity management.
- **Secure Checkout:** Integrated with **Stripe** and **Razorpay** for global payments, plus Cash on Delivery (COD).
- **User Accounts:** JWT-based authentication with secure login and registration.
- **Order Tracking:** Keep tab on your fashion journey with detailed order history.

### 💼 For Administrators
- **Inventory Management:** Full CRUD operations for products (Add, Edit, Delete).
- **Cloud Media Hosting:** Integrated with **Cloudinary** for high-performance image optimization.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite, Axios, React Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Payments:** Stripe API, Razorpay
- **Images:** Cloudinary (CDN)
- **Authenticaton:** JSON Web Tokens (JWT) & BcryptJS

---

## 💻 Local Setup Guide

### 1. Clone the repository
```bash
git clone https://github.com/orewahamza/e-com-.git
cd e-com-
```

### 2. Backend Configuration
Navigate to the `backend` folder and install dependencies:
```bash
cd forever-shopping/backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
MONGODB_URL = your_mongodb_uri
CLOUDINARY_API_KEY = your_key
CLOUDINARY_SECRET_KEY = your_secret
CLOUDINARY_NAME = your_name
JWT_SECRET = your_secret
ADMIN_EMAIL = admin@fashshop.com
ADMIN_PASSWORD = your_password
STRIPE_SECRET_KEY = your_stripe_key
RAZORPAY_KEY_SECRET = your_razorpay_secret
RAZORPAY_KEY_ID = your_razorpay_id
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Configuration
Navigate to the `frontend` folder and install dependencies:
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_BACKEND_URL = http://localhost:5000
```
Start the application:
```bash
npm run dev
```

---

---

## 🛡️ License
This project is licensed under the MIT License.

## 🤝 Contact
**Hamza** - [@orewahamza](https://github.com/orewahamza)
Project source code Link: [https://github.com/orewahamza/e-com-](https://github.com/orewahamza/e-com-)

---
*⭐ If you like this project, feel free to give it a star!*
