# 🚀 Quick Start Guide - Forever Shopping E-Commerce

## Prerequisites Installation

### 1. Install MongoDB (Required)

#### Option A: MongoDB Community Server (Recommended for Development)
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run automatically on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud - Free Tier)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `.env` file with your connection string:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/e-commerce
   ```

### 2. Verify Node.js Installation
```bash
node --version
# Should show v20.x.x or higher
```

---

## Setup Instructions

### Step 1: Backend Setup

```powershell
# Navigate to backend directory
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\backend

# Install dependencies (already done ✓)
npm install

# Start backend server
npm start
```

**Expected Output:**
```
Starting server...
Server is running on port : 4000
MongoDB Connected
```

### Step 2: Frontend Setup

Open a **NEW terminal** and run:

```powershell
# Navigate to frontend directory
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### Step 3: Admin Panel Setup

Open another **NEW terminal** and run:

```powershell
# Navigate to admin directory
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\admin

# Install dependencies
npm install

# Start admin development server
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
Local: http://localhost:5174/
```

---

## Access the Application

Once all servers are running:

- **Frontend (Customer)**: http://localhost:5173
- **Admin Panel**: http://localhost:5174
- **Backend API**: http://localhost:4000

---

## Configuration

### Email Setup (Optional - for order notifications)

1. **Using Gmail:**
   - Enable 2-Step Verification in your Google Account
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Update `.env` in backend:
     ```
     SMTP_EMAIL=your-email@gmail.com
     SMTP_PASSWORD=your-app-password
     ```

2. **Using Other SMTP Providers:**
   - Update SMTP configuration in backend `.env`

### Payment Gateways (Optional)

#### Stripe
1. Create account: https://stripe.com
2. Get API keys from Dashboard
3. Already configured in the code

#### Razorpay
1. Create account: https://razorpay.com
2. Get API keys from Dashboard
3. Already configured in the code

---

## Testing the Application

### 1. Create Admin Account
You'll need to register first, then manually set the user type to "admin" in MongoDB:

```javascript
// In MongoDB Compass or Shell
db.users.updateOne(
  { email: "your-admin-email@example.com" },
  { $set: { type: "admin", role: "admin" } }
)
```

### 2. Test Flow

**Customer Flow:**
1. Register/Login
2. Browse products
3. Add to cart
4. Proceed to checkout
5. Fill delivery information
6. Place order (COD)
7. View orders in "My Orders"

**Admin Flow:**
1. Login to admin panel
2. View all orders
3. Update order status
4. Manage products

---

## Troubleshooting

### MongoDB Connection Error
```
MongoParseError: Invalid scheme
```
**Solution:** 
- Install MongoDB OR use MongoDB Atlas
- Update `MONGODB_URL` in `.env`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solution:**
- Change port in `.env`: `PORT=4001`
- Or kill the process using port 4000

### PowerShell Execution Policy Error
```
cannot be loaded because running scripts is disabled
```
**Solution:** (Already fixed ✓)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### CORS Errors
**Solution:**
- Make sure backend is running on port 4000
- Check `VITE_BACKEND_URL` in frontend `.env`

---

## Environment Variables

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017/e-commerce
JWT_SECRET=your_secret_key
PORT=4000
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your_smtp_password
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:4000
```

### Admin (.env)
```env
VITE_BACKEND_URL=http://localhost:4000
```

---

## Common Commands

### Start All Services
```powershell
# Terminal 1 - Backend
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\backend
npm start

# Terminal 2 - Frontend
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\frontend
npm run dev

# Terminal 3 - Admin
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\admin
npm run dev
```

### Install Dependencies
```powershell
npm install
```

### Build for Production
```powershell
npm run build
```

---

## Next Steps

1. ✅ Backend running on port 4000
2. ⏳ Install MongoDB
3. ⏳ Start frontend
4. ⏳ Start admin panel
5. ⏳ Register and test

---

## Need Help?

Check the detailed improvements in: [IMPROVEMENTS.md](./IMPROVEMENTS.md)

---

**Happy Coding! 🎉**
