# 🛍️ fash shop - Modern E-Commerce Platform

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a complete order management system, multiple payment gateways, and an intuitive admin panel.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-v20+-brightgreen)
![React](https://img.shields.io/badge/React-v18-blue)

---

## ✨ Features

### Customer Features
- 🛒 **Product Browsing**: Browse products with advanced filtering and search
- 🛍️ **Shopping Cart**: Add, update, and remove items from cart
- 👤 **User Authentication**: Secure registration and login system
- 💳 **Multiple Payment Options**: 
  - Cash on Delivery (COD)
  - Stripe Payment Gateway
  - Razorpay Payment Gateway
- 📦 **Order Tracking**: Real-time order status tracking
- 📧 **Email Notifications**: Automatic order confirmation and status updates
- 📱 **Responsive Design**: Works seamlessly on all devices

### Admin Features
- 📊 **Dashboard**: Overview of sales and orders
- 📦 **Order Management**: View, update, and manage all orders
- 🏷️ **Product Management**: Add, edit, and delete products
- 🖼️ **Image Upload**: Cloudinary integration for product images
- 👥 **User Management**: Manage customer accounts
- 📈 **Analytics**: Track sales and performance metrics

### Technical Features
- 🔐 **JWT Authentication**: Secure token-based authentication
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS
- 🗄️ **MongoDB**: Robust database with optimized queries
- ⚡ **Performance**: Optimized with indexes and caching
- 📝 **Clean Code**: Well-structured and documented codebase
- 🔔 **Email Service**: Automated email notifications

---

## 🚀 Live Demo

**Coming Soon** - Deploy your own instance following the setup instructions below.

---

## 📸 Screenshots

### Customer Interface
- Homepage with product listings
- Product details page
- Shopping cart
- Checkout process
- Order history

### Admin Panel
- Dashboard with analytics
- Order management
- Product management
- User management

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Toastify** - Notifications
- **React Helmet** - SEO

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Stripe** - Payment processing
- **Razorpay** - Payment processing
- **Cloudinary** - Image hosting
- **Firebase** - Authentication

---

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Choose one:
  - Local MongoDB installation - [Download](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (Cloud) - [Sign Up](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** - Package manager

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/forever-shopping.git
cd forever-shopping
```

### 2. Environment Setup

You need to configure environment variables for the backend, frontend, and admin panel.

#### Backend Configuration (`backend/.env`)

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URL=mongodb://localhost:27017/e-commerce

# Cloudinary (for image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Email Configuration (for order notifications)
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your_smtp_app_password

# Server Configuration
PORT=4000
NODE_ENV=development

# Admin Credentials
ADMIN_EMAIL=admin@forevershopping.com
ADMIN_PASSWORD=your_admin_password

# Firebase Authentication
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Getting the credentials:**
- **MongoDB**: Install locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Cloudinary**: Sign up at [Cloudinary](https://cloudinary.com/)
- **SMTP Email**: Use Gmail with App Password or any SMTP provider
- **Firebase**: Create a project at [Firebase Console](https://console.firebase.google.com/)

#### Frontend Configuration (`frontend/.env`)

Create a `.env` file in the `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:4000

# Firebase Configuration (optional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

#### Admin Configuration (`admin/.env`)

Create a `.env` file in the `admin` directory:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install admin dependencies
cd ../admin
npm install
```

---

## 🎮 Running the Application

You need to run three services simultaneously. Open three terminal windows:

### Terminal 1 - Backend Server

```bash
cd backend
npm start
```

Backend will run on: **http://localhost:4000**

### Terminal 2 - Frontend (Customer Site)

```bash
cd frontend
npm run dev
```

Frontend will run on: **http://localhost:5173**

### Terminal 3 - Admin Panel

```bash
cd admin
npm run dev
```

Admin will run on: **http://localhost:5174**

---

## 📖 Usage

### For Customers

1. **Browse Products**: Visit http://localhost:5173
2. **Register/Login**: Create an account or login
3. **Add to Cart**: Select products and add to cart
4. **Checkout**: Fill in delivery information
5. **Place Order**: Choose payment method and confirm
6. **Track Orders**: View order status in "My Orders"

### For Admins

1. **Access Admin Panel**: Visit http://localhost:5174
2. **Login**: Use admin credentials
3. **Manage Orders**: View and update order status
4. **Manage Products**: Add/edit/delete products
5. **View Analytics**: Monitor sales and performance

---

## 🏗️ Project Structure

```
forever-shopping/
├── backend/                 # Express.js backend
│   ├── config/             # Database configurations
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Helper functions
│   └── server.js          # Entry point
│
├── frontend/               # React customer application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   └── public/            # Static assets
│
└── admin/                  # React admin panel
    ├── src/
    │   ├── components/    # Admin components
    │   ├── pages/         # Admin pages
    │   └── App.jsx        # Admin app component
    └── public/            # Static assets
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile

### Products
- `GET /api/product/list` - Get all products
- `GET /api/product/:id` - Get single product
- `POST /api/product/add` - Add product (Admin)
- `PUT /api/product/:id` - Update product (Admin)
- `DELETE /api/product/:id` - Delete product (Admin)

### Cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/get` - Get user cart
- `POST /api/cart/update` - Update cart item
- `POST /api/cart/remove` - Remove from cart

### Orders
- `POST /api/order/place` - Place COD order
- `POST /api/order/stripe` - Place Stripe order
- `POST /api/order/razorpay` - Place Razorpay order
- `POST /api/order/userorders` - Get user orders
- `POST /api/order/cancel` - Cancel order
- `GET /api/order/list` - Get all orders (Admin)
- `POST /api/order/status` - Update order status (Admin)

---

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Connect your GitHub repository
3. Deploy automatically on push

### Frontend & Admin Deployment (Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to Vercel or Netlify
3. Set `VITE_BACKEND_URL` to your production backend URL

---

## 🔒 Security

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable protection
- Secure HTTP headers

---

## 📧 Email Notifications

The system automatically sends:
- **Order Confirmation**: When a customer places an order
- **Status Updates**: When admin updates order status

To configure email:
1. Use Gmail with App Password (recommended for development)
2. Or use services like SendGrid, Mailgun for production

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- MongoDB for database
- Express.js team for the framework
- React team for the UI library
- Node.js team for the runtime
- All contributors and supporters

---

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Contact via email

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Happy Shopping! 🛍️**
