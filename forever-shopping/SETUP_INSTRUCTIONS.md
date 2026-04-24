# 🚀 Setup Instructions / تعليمات الإعداد

## ⚠️ Important / مهم

**You need to install MongoDB first!** / **يجب تثبيت MongoDB أولاً!**

---

## Quick Start / البداية السريعة

### Option 1: Use the Script (Easiest) / الخيار 1: استخدام السكربت

```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping
.\start-all.ps1
```

This will try to start all services automatically.

---

### Option 2: Manual Start / الخيار 2: التشغيل اليدوي

You need to open **3 terminals** / تحتاج لفتح **3 نوافذ терминал**:

#### Terminal 1 - Backend / Backends
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\backend
npm start
```

#### Terminal 2 - Frontend / الواجهة
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\frontend
npm install
npm run dev
```

#### Terminal 3 - Admin / لوحة الإدارة
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\admin
npm install
npm run dev
```

---

## MongoDB Setup / إعداد MongoDB

### Option A: Install MongoDB Locally / التثبيت المحلي

1. **Download** / تحميل:
   https://www.mongodb.com/try/download/community

2. **Install** with default settings / التثبيت بالإعدادات الافتراضية

3. **It will run automatically** / سيعمل تلقائياً على:
   ```
   mongodb://localhost:27017
   ```

### Option B: MongoDB Atlas (Cloud - Free) / سحابي

1. **Create account** / إنشاء حساب:
   https://www.mongodb.com/cloud/atlas/register

2. **Create free cluster** / إنشاء مجموعة مجانية

3. **Get connection string** / الحصول على رابط الاتصال

4. **Update backend/.env** / تحديث الملف:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/e-commerce
   ```

---

## After MongoDB is Installed / بعد تثبيت MongoDB

### 1. Start Backend / تشغيل Backend
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\backend
npm start
```

**Expected output** / الناتج المتوقع:
```
Starting server...
Server is running on port : 4000
MongoDB Connected
```

### 2. Start Frontend / تشغيل الواجهة
Open new terminal / افتح терминал جديد:
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\frontend
npm install
npm run dev
```

**Expected output** / الناتج المتوقع:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### 3. Start Admin / تشغيل لوحة الإدارة
Open new terminal / افتح терминал جديد:
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\admin
npm install
npm run dev
```

**Expected output** / الناتج المتوقع:
```
VITE ready in XXX ms
Local: http://localhost:5174/
```

---

## Access the Website / الدخول للموقع

- **Customer Website** / موقع العملاء: http://localhost:5173
- **Admin Panel** / لوحة الإدارة: http://localhost:5174
- **Backend API** / الخادم: http://localhost:4000

---

## First Time Setup / الإعداد لأول مرة

### Create Admin Account / إنشاء حساب مسؤول

1. **Register on the website** / سجّل في الموقع
2. **Open MongoDB** / افتح MongoDB
3. **Update your user** / حدث المستخدم:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { type: "admin", role: "admin" } }
)
```

---

## Troubleshooting / حل المشاكل

### Problem: MongoDB Error / خطأ MongoDB
```
MongoParseError: Invalid scheme
```

**Solution** / الحل:
- Install MongoDB / ثبّت MongoDB
- OR use MongoDB Atlas / أو استخدم MongoDB Atlas
- Update `.env` file / حدّث ملف `.env`

---

### Problem: Port Already Used / المنفذ مستخدم
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution** / الحل:
- Change port in `.env` / غيّر المنفذ في `.env`:
  ```
  PORT=4001
  ```

---

### Problem: PowerShell Error / خطأ PowerShell
```
cannot be loaded because running scripts is disabled
```

**Solution** / الحل (Already fixed / مُصلح بالفعل):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Email Setup (Optional) / إعداد البريد الإلكتروني

For order notifications / لإشعارات الطلبات:

1. **Gmail:**
   - Enable 2-Step Verification / التفعيل بخطوتين
   - Create App Password: https://myaccount.google.com/apppasswords
   - Update `backend/.env`:
     ```
     SMTP_EMAIL=your-email@gmail.com
     SMTP_PASSWORD=app-password-here
     ```

---

## Files Created / الملفات المنشأة

✅ `backend/.env` - Backend configuration  
✅ `frontend/.env` - Frontend configuration  
✅ `admin/.env` - Admin configuration  
✅ `start-all.ps1` - Auto-start script  
✅ `QUICK_START.md` - Detailed guide  
✅ `SETUP_INSTRUCTIONS.md` - This file  

---

## Next Steps / الخطوات التالية

1. ✅ PowerShell fixed / إصلاح PowerShell
2. ✅ Dependencies installed / تثبيت المكتبات
3. ✅ Environment files created / إنشاء ملفات الإعداد
4. ⏳ **Install MongoDB** / **تثبيت MongoDB** ← YOU ARE HERE
5. ⏳ Start all services / تشغيل جميع الخدمات
6. ⏳ Register and test / التسجيل والاختبار

---

## Need Help? / تحتاج مساعدة؟

📖 Read: [QUICK_START.md](./QUICK_START.md)  
📖 Read: [IMPROVEMENTS.md](./IMPROVEMENTS.md)  

---

**Good Luck! / بالتوفيق! 🎉**
