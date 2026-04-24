# 🚀 تثبيت MongoDB محلياً - دليل سريع

## الخطوة 1: تحميل MongoDB
👉 **رابط التحميل**: https://www.mongodb.com/try/download/community

**اختار:**
- Version: **أحدث نسخة (8.0 أو أعلى)**
- Platform: **Windows**
- Package: **MSI**

---

## الخطوة 2: التثبيت

1. شغل ملف `.msi` اللي نزلته
2. اختار **"Complete"** installation
3. ✅ **علم على**: "Install MongoDB as a Service"
4. ✅ **علم على**: "Run service as Network Service user"
5. اضغط **Next** → **Install**
6. استنى لحد ما يخلص

---

## الخطوة 3: التأكد من التثبيت

افتح **terminal جديد** واكتب:
```powershell
mongod --version
```

لازم تشوف معلومات النسخة.

---

## الخطوة 4: تشغيل المشروع

بعد ما MongoDB يتثبت:

```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\backend
npm start
```

**لازم تشوف:**
```
Server is running on port : 4000
MongoDB Connected
```

---

## بعد ما الـ Backend يشتغل:

افتح **2 terminal جديد**:

### Terminal 2 - Frontend
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\frontend
npm run dev
```

### Terminal 3 - Admin
```powershell
cd d:\Compressed\fash-shop-main\fash-shop-main\forever-shopping\admin
npm run dev
```

---

## الدخول للموقع:

- **الموقع**: http://localhost:5173
- **لوحة الإدارة**: http://localhost:5174
- **الخادم**: http://localhost:4000

---

## حل المشاكل

### لو الـ MongoDB Service مش شغال
```powershell
# شغله يدوي
net start MongoDB

# أو
Start-Service MongoDB
```

### لو المنفذ 27017 مستخدم
```powershell
# شوف اللي مستعمل المنفذ
netstat -ano | findstr :27017

# اقفل العملية
taskkill /PID <الرقم> /F
```

---

## ✅ قائمة التحقق

- [ ] نزلت MongoDB Community Server
- [ ] ثبتّه مع خيار "Install as Service"
- [ ] تأكدت: `mongod --version` شغال
- [ ] شغلت الـ backend: `npm start`
- [ ] شفت رسالة "MongoDB Connected"
- [ ] شغلت الـ frontend والـ admin
- [ ] الموقع شغال! 🎉

---

## 📝 ملاحظات مهمة

✅ **المميزات:**
- مش محتاج إنترنت
- أسرع من السحابة
- مجاني 100%
- البيانات على جهازك

⚠️ **تحذير:**
- البيانات محفوظة على جهازك بس
- للاختبار والتطوير المحلي
- للإنتاج استخدم MongoDB Atlas

---

**ثبّت MongoDB دلوقتي والمشروع هيشغل عندك محلياً من غير أي مشاكل!**

الرابط: https://www.mongodb.com/try/download/community
