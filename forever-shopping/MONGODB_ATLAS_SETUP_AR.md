# 🚀 إعداد MongoDB Atlas - دليل كامل بالعربي

## الخطوة 1: إنشاء حساب على MongoDB Atlas

1. **افتح الرابط**: https://www.mongodb.com/cloud/atlas/register
2. **سجل** باستخدام Google أو GitHub أو الإيميل
3. **مجاني تماماً** للاستخدام الأساسي

---

## الخطوة 2: إنشاء Cluster مجاني

بعد ما تدخل:

1. اضغط على **"Build a Database"** أو **"Create"**
2. اختار **"FREE"** (M0 Sandbox)
3. اختار مزود الخدمة (AWS أو Google Cloud أو Azure)
4. اختار منطقة **قريبة منك**
5. اضغط **"Create Cluster"** (ياخد 2-3 دقائق)

---

## الخطوة 3: إنشاء مستخدم قاعدة البيانات

1. اضغط على **"Database Access"** في القائمة على الشمال
2. اضغط **"+ ADD NEW DATABASE USER"**
3. اختار **"Password"**
4. املأ البيانات:
   - Username: `admin`
   - Password: (اختار كلمة سر قوية، **احفظها!**)
5. اختار الصلاحيات: **"Read and write to any database"**
6. اضغط **"Add User"**

---

## الخطوة 4: السماح بالاتصال من جهازك

1. اضغط على **"Network Access"** في القائمة على الشمال
2. اضغط **"+ ADD IP ADDRESS"**
3. اضغط **"ALLOW ACCESS FROM ANYWHERE"** (للتطوير)
   - أو ضيف الـ IP بتاعك: `0.0.0.0/0`
4. اضغط **"Confirm"**

---

## الخطوة 5: الحصول على رابط الاتصال

1. اضغط على **"Database"** في القائمة على الشمال
2. اضغط على زرار **"Connect"** بتاع الـ Cluster
3. اختار **"Connect your application"**
4. اختار:
   - Driver: **Node.js**
   - Version: **5.5 or later**
5. **انسخ رابط الاتصال** (هيكون شكله كده):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## الخطوة 6: تحديث ملف .env

افتح ملف `backend\.env` واستبدل:

```env
MONGODB_URL=mongodb+srv://admin:ضع-كلمة-السر-هنا@cluster0.xxxxx.mongodb.net/e-commerce?retryWrites=true&w=majority
```

### مثال حقيقي:
لو كلمة السر بتاعتك هي `MyPassword123` والـ cluster اسمه `cluster0.abc123`

يكون الرابط:
```env
MONGODB_URL=mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/e-commerce?retryWrites=true&w=majority
```

⚠️ **مهم جداً:**
- استبدل `admin` بيوزر نيم اللي انت عملته
- استبدل كلمة السر
- استبدل `cluster0.xxxxx` باسم الـ Cluster بتاعك

---

## الخطوة 7: تشغيل المشروع

### طريقة 1: باستخدام السكربت (أسهل)

```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping
.\start-all.ps1
```

### طريقة 2: يدوياً

افتح **3 نوافذ terminal**:

#### Terminal 1 - Backend
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\backend
npm start
```

**الناتج المتوقع:**
```
Starting server...
Server is running on port : 4000
MongoDB Connected
```

#### Terminal 2 - Frontend
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\frontend
npm install
npm run dev
```

#### Terminal 3 - Admin
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\admin
npm install
npm run dev
```

---

## الخطوة 8: الدخول للموقع

- **موقع العملاء**: http://localhost:5173
- **لوحة الإدارة**: http://localhost:5174
- **الخادم**: http://localhost:4000

---

## 🔧 إنشاء حساب أدمن

بعد ما تشغل الموقع:

1. **سجل حساب جديد** على الموقع
2. **افتح MongoDB Atlas**
3. **اضغط على "Browse Collections"**
4. **اختار قاعدة البيانات** `e-commerce`
5. **اختار `users`**
6. **ابحث عن حسابك** وحدثه:

أو استخدم MongoDB Compass:

```javascript
db.users.updateOne(
  { email: "إيميل-بتاعك@example.com" },
  { $set: { type: "admin", role: "admin" } }
)
```

---

## ❌ حل المشاكل

### مشكلة: خطأ في الاتصال
```
MongoServerError: bad auth
```

**الحل:**
- تأكد إن كلمة السر صحيحة
- تأكد إن اليوزر نيم صحيح
- تأكد إنك استبدلت كل `<password>` و `<cluster>`

---

### مشكلة: الاتصال مرفوض
```
MongoNetworkError: connection timeout
```

**الحل:**
- تأكد إنك ضفت `0.0.0.0/0` في Network Access
- تأكد إن الإنترنت عندك شغال

---

### مشكلة: رابط خطأ
```
MongoParseError: Invalid scheme
```

**الحل:**
- تأكد إن الرابط بيبدأ بـ `mongodb+srv://`
- مش `mongodb://`

---

## 📝 مثال كامل لملف .env

```env
MONGODB_URL=mongodb+srv://admin:MySecurePassword123@cluster0.abc123.mongodb.net/e-commerce?retryWrites=true&w=majority
CLOUDINARY_NAME=ducyosoyr
CLOUDINARY_API_KEY=419497351168737
CLOUDINARY_SECRET_KEY=LDu794YG5EH94asmOftLk_GDqvo
JWT_SECRET=my_secret_key_change_this
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your_app_password
PORT=4000
NODE_ENV=development
ADMIN_EMAIL=admin@forevershopping.com
ADMIN_PASSWORD=admin123
```

---

## ✅ قائمة التحقق

- [ ] أنشأت حساب على MongoDB Atlas
- [ ] أنشأت Cluster مجاني
- [ ] أنشأت مستخدم قاعدة بيانات
- [ ] سمحت بالاتصال من أي IP
- [ ] نسخت رابط الاتصال
- [ ] حدثت ملف `backend\.env`
- [ ] شغلت Backend
- [ ] شغلت Frontend
- [ ] شغلت Admin
- [ ] الموقع شغال! 🎉

---

## 🎯 روابط مفيدة

- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **MongoDB Compass** (اختياري): https://www.mongodb.com/try/download/compass
- **التوثيق الرسمي**: https://www.mongodb.com/docs/atlas/

---

**بالتوفيق! 🚀**

لو عندك أي مشكلة، كلمني!
