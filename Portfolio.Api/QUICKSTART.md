# 📋 خطوات التشغيل السريعة

## ⚡ البدء السريع

### 1. تثبيت الحزم (إذا لم تكن مثبتة)
```powershell
cd d:/PorpuleVSCodeProject/Portfolio.Api/Portfolio.Api
dotnet restore
```

### 2. إنشاء Migration
```powershell
dotnet ef migrations add InitialCreate
```

### 3. تحديث قاعدة البيانات
```powershell
dotnet ef database update
```

### 4. تشغيل المشروع
```powershell
dotnet run
```

---

## 🔧 إذا واجهت مشكلة في SQL Server

### الخيار 1: استخدام LocalDB (مثبت مع Visual Studio)
في `appsettings.json`:
```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=PortfolioDB;Trusted_Connection=True;TrustServerCertificate=True"
```

### الخيار 2: استخدام SQL Server Express
في `appsettings.json`:
```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=PortfolioDB;Trusted_Connection=True;TrustServerCertificate=True"
```

### الخيار 3: استخدام SQL Server Authentication
في `appsettings.json`:
```json
"DefaultConnection": "Server=localhost;Database=PortfolioDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
```

---

## 📝 بيانات تسجيل الدخول الافتراضية

```
Username: admin
Password: Admin@123
```

---

## 🌐 عناوين الوصول بعد التشغيل

- **Swagger UI:** https://localhost:5001 أو http://localhost:5000
- **API Base URL:** https://localhost:5001/api

---

## 🧪 اختبار سريع

### 1. تسجيل الدخول
```bash
curl -X POST "https://localhost:5001/api/Auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"Admin@123\"}"
```

### 2. الحصول على المهارات
```bash
curl -X GET "https://localhost:5001/api/Skills"
```

---

## 🐛 حل المشاكل الشائعة

### مشكلة: "Unable to connect to SQL Server"
**الحل:**
1. تأكد من تشغيل SQL Server
2. تحقق من Connection String
3. جرب LocalDB بدلاً من SQL Server

### مشكلة: "dotnet ef command not found"
**الحل:**
```powershell
dotnet tool install --global dotnet-ef
```

### مشكلة: "Build failed"
**الحل:**
```powershell
dotnet clean
dotnet build
```

---

## ✅ التحقق من نجاح التثبيت

بعد تشغيل المشروع، يجب أن ترى:
```
✅ تم إنشاء قاعدة البيانات وإضافة البيانات الأولية بنجاح
🚀 Portfolio API يعمل الآن...
```

---

## 📞 الدعم

إذا استمرت المشاكل، تحقق من:
- [ ] .NET 8 SDK مثبت
- [ ] SQL Server يعمل
- [ ] Connection String صحيح
- [ ] جميع الحزم مثبتة
