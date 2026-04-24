# 🚀 Install MongoDB Local - Quick Guide

## Option 1: Quick Install (Recommended)

### Step 1: Download MongoDB
👉 **Download Link**: https://www.mongodb.com/try/download/community

**Choose:**
- Version: **Latest (8.0 or higher)**
- Platform: **Windows**
- Package: **MSI**

### Step 2: Install
1. Run the downloaded `.msi` file
2. Choose **"Complete"** installation
3. ✅ **Check**: "Install MongoDB as a Service"
4. ✅ **Check**: "Run service as Network Service user"
5. Click **Next** → **Install**

### Step 3: Verify Installation
Open a NEW terminal and run:
```powershell
mongod --version
```

You should see version info.

### Step 4: Start the Project
After MongoDB is installed:
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\backend
npm start
```

**You should see:**
```
Server is running on port : 4000
MongoDB Connected
```

---

## Option 2: Use Chocolatey (Automatic)

If you have Chocolatey package manager:

```powershell
# Install MongoDB
choco install mongodb -y

# Start MongoDB service
net start MongoDB

# Verify
mongod --version
```

---

## Option 3: Use Scoop (Automatic)

If you have Scoop package manager:

```powershell
# Install MongoDB
scoop install mongodb

# Create data directory
mkdir C:\Users\YourUsername\data\db

# Start MongoDB
mongod
```

---

## After MongoDB is Installed:

### Start All Services:

**Terminal 1 - Backend:**
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\frontend
npm run dev
```

**Terminal 3 - Admin:**
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\admin
npm run dev
```

### Access Your Website:
- **Frontend**: http://localhost:5173
- **Admin**: http://localhost:5174
- **Backend API**: http://localhost:4000

---

## Troubleshooting

### MongoDB Service Not Starting
```powershell
# Start manually
net start MongoDB

# Or run as background process
Start-Service MongoDB
```

### Port 27017 Already in Use
```powershell
# Find what's using the port
netstat -ano | findstr :27017

# Kill the process
taskkill /PID <PID> /F
```

### MongoDB Not in PATH
Add to your system PATH:
```
C:\Program Files\MongoDB\Server\8.0\bin
```
(Adjust version number as needed)

---

## ✅ Quick Checklist

- [ ] Download MongoDB Community Server
- [ ] Install with "Install as Service" option
- [ ] Verify: `mongod --version` works
- [ ] Start backend: `npm start`
- [ ] See "MongoDB Connected" message
- [ ] Start frontend and admin
- [ ] Website works! 🎉

---

**Download MongoDB now and your project will run locally without any cloud dependency!**
