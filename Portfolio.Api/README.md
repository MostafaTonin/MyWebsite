# 🚀 Portfolio API - ASP.NET Core 8

## 📋 نظرة عامة

Backend كامل لموقع Portfolio احترافي مبني باستخدام **ASP.NET Core 8 Web API** مع **SQL Server** و **Entity Framework Core**.

---

## ✨ المميزات

### 🔐 المصادقة والأمان
- ✅ JWT Authentication
- ✅ Role-based Authorization (Admin)
- ✅ Password Hashing باستخدام BCrypt
- ✅ Secure API Endpoints

### 🌍 دعم اللغات
- ✅ دعم اللغة العربية (افتراضي)
- ✅ دعم اللغة الإنجليزية
- ✅ Localization Middleware

### 📊 قاعدة البيانات
- ✅ SQL Server مع Entity Framework Core
- ✅ Code-First Migrations
- ✅ Seed Data تلقائي
- ✅ العلاقات بين الجداول

### 🎯 الوظائف
- ✅ CRUD كامل لجميع الموديلات
- ✅ Upload/Delete Images
- ✅ Pagination للمدونة
- ✅ Global Exception Handling
- ✅ Logging
- ✅ Swagger Documentation

---

## 🗂️ هيكل المشروع

```
Portfolio.Api/
├── Controllers/          # API Controllers
│   ├── AuthController.cs
│   ├── SkillsController.cs
│   ├── ProjectsController.cs
│   ├── BlogController.cs
│   ├── ServicesController.cs
│   ├── AboutController.cs
│   ├── ContactController.cs
│   └── UploadController.cs
├── Entities/            # Database Models
│   ├── User.cs
│   ├── Skill.cs
│   ├── Project.cs
│   ├── ProjectImage.cs
│   ├── Service.cs
│   ├── BlogPost.cs
│   ├── BlogCategory.cs
│   ├── AboutSection.cs
│   └── ContactMessage.cs
├── DTOs/                # Data Transfer Objects
├── Data/                # DbContext & Seeder
│   ├── PortfolioDbContext.cs
│   └── DbSeeder.cs
├── Services/            # Business Logic
│   ├── AuthService.cs
│   └── BlogService.cs
├── Repositories/        # Data Access Layer
│   └── Repository.cs
├── Interfaces/          # Abstractions
├── Middleware/          # Custom Middleware
│   ├── GlobalExceptionMiddleware.cs
│   └── LocalizationMiddleware.cs
├── Helpers/             # Utility Classes
│   ├── FileUploadHelper.cs
│   └── PaginationHelper.cs
└── Program.cs           # Application Entry Point
```

---

## 📦 الجداول في قاعدة البيانات

| الجدول | الوصف |
|--------|-------|
| **Users** | مستخدمي النظام (Admin) |
| **Skills** | المهارات البرمجية |
| **Projects** | المشاريع |
| **ProjectImages** | صور المشاريع |
| **Services** | الخدمات المقدمة |
| **BlogPosts** | مقالات المدونة |
| **BlogCategories** | فئات المدونة |
| **AboutSections** | أقسام صفحة About |
| **ContactMessages** | رسائل التواصل |

---

## 🚀 خطوات التشغيل

### 1️⃣ المتطلبات
- ✅ .NET 8 SDK
- ✅ SQL Server (LocalDB أو Express أو Full)
- ✅ Visual Studio 2022 أو VS Code

### 2️⃣ تثبيت الحزم (تم تثبيتها مسبقاً)
```powershell
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package BCrypt.Net-Next
dotnet add package Swashbuckle.AspNetCore.Annotations
```

### 3️⃣ تحديث Connection String
افتح ملف `appsettings.json` وعدّل Connection String حسب إعدادات SQL Server لديك:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PortfolioDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**ملاحظة:** إذا كنت تستخدم SQL Server Express:
```
Server=localhost\\SQLEXPRESS;Database=PortfolioDB;...
```

### 4️⃣ إنشاء Migration
```powershell
dotnet ef migrations add InitialCreate
```

### 5️⃣ تحديث قاعدة البيانات
```powershell
dotnet ef database update
```

**أو** ببساطة شغّل المشروع وسيتم إنشاء قاعدة البيانات تلقائياً!

### 6️⃣ تشغيل المشروع
```powershell
dotnet run
```

أو اضغط **F5** في Visual Studio

---

## 📖 اختبار API عبر Swagger

1. بعد تشغيل المشروع، افتح المتصفح على:
   ```
   https://localhost:5001
   ```
   أو
   ```
   http://localhost:5000
   ```

2. ستظهر لك واجهة **Swagger UI** مباشرة

### 🔐 تسجيل الدخول والحصول على Token

#### الخطوة 1: تسجيل الدخول
```http
POST /api/Auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123"
}
```

**الاستجابة:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "تم تسجيل الدخول بنجاح"
}
```

#### الخطوة 2: استخدام Token في Swagger
1. انسخ الـ Token من الاستجابة
2. اضغط على زر **Authorize** 🔒 في أعلى الصفحة
3. أدخل: `Bearer {token}`
4. اضغط **Authorize**

الآن يمكنك الوصول لجميع الـ Endpoints المحمية!

---

## 🔌 API Endpoints

### 🔐 Authentication
| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| POST | `/api/Auth/login` | تسجيل الدخول | ❌ |

### 💪 Skills
| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| GET | `/api/Skills` | جميع المهارات | ❌ |
| GET | `/api/Skills/{id}` | مهارة محددة | ❌ |
| POST | `/api/Skills` | إضافة مهارة | ✅ Admin |
| PUT | `/api/Skills/{id}` | تحديث مهارة | ✅ Admin |
| DELETE | `/api/Skills/{id}` | حذف مهارة | ✅ Admin |

### 📁 Projects
| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| GET | `/api/Projects` | جميع المشاريع | ❌ |
| GET | `/api/Projects/{id}` | مشروع محدد | ❌ |
| POST | `/api/Projects` | إضافة مشروع | ✅ Admin |
| PUT | `/api/Projects/{id}` | تحديث مشروع | ✅ Admin |
| DELETE | `/api/Projects/{id}` | حذف مشروع | ✅ Admin |

### 📝 Blog
| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| GET | `/api/Blog?page=1&pageSize=10` | جميع المقالات | ❌ |
| GET | `/api/Blog/{id}` | مقال محدد | ❌ |
| GET | `/api/Blog/categories` | جميع الفئات | ❌ |
| POST | `/api/Blog` | إضافة مقال | ✅ Admin |
| PUT | `/api/Blog/{id}` | تحديث مقال | ✅ Admin |
| DELETE | `/api/Blog/{id}` | حذف مقال | ✅ Admin |

### 🛠️ Services
| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| GET | `/api/Services` | جميع الخدمات | ❌ |
| GET | `/api/Services/{id}` | خدمة محددة | ❌ |
| POST | `/api/Services` | إضافة خدمة | ✅ Admin |
| PUT | `/api/Services/{id}` | تحديث خدمة | ✅ Admin |
| DELETE | `/api/Services/{id}` | حذف خدمة | ✅ Admin |

### 👤 About
| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| GET | `/api/About` | جميع الأقسام | ❌ |
| GET | `/api/About/{id}` | قسم محدد | ❌ |
| POST | `/api/About` | إضافة قسم | ✅ Admin |
| PUT | `/api/About/{id}` | تحديث قسم | ✅ Admin |
| DELETE | `/api/About/{id}` | حذف قسم | ✅ Admin |

### 📧 Contact
| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| POST | `/api/Contact` | إرسال رسالة | ❌ |
| GET | `/api/Contact` | جميع الرسائل | ✅ Admin |
| GET | `/api/Contact/{id}` | رسالة محددة | ✅ Admin |
| DELETE | `/api/Contact/{id}` | حذف رسالة | ✅ Admin |
| PATCH | `/api/Contact/{id}/mark-read` | تحديث حالة القراءة | ✅ Admin |

### 📤 Upload
| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| POST | `/api/Upload/image?folder=general` | رفع صورة | ✅ Admin |
| DELETE | `/api/Upload/image?imageUrl=/path` | حذف صورة | ✅ Admin |

---

## 🌐 دعم اللغات (Localization)

أرسل اللغة المطلوبة في الـ Header:

```http
Accept-Language: ar
```
أو
```http
Accept-Language: en
```

**اللغة الافتراضية:** العربية (ar)

---

## 🔧 البيانات الأولية (Seed Data)

عند أول تشغيل، سيتم إضافة:

### 👤 Admin User
- **Username:** `admin`
- **Password:** `Admin@123`

### 📚 Blog Categories
- برمجة / Programming
- تصميم / Design
- تقنية / Technology

### 💪 Skills
- C# (90%)
- ASP.NET Core (85%)
- SQL Server (80%)
- JavaScript (75%)

### 🛠️ Services
- تطوير تطبيقات الويب
- تطوير APIs

### 👤 About Section
- قسم "من أنا" افتراضي

---

## 📝 ملاحظات مهمة

### 🔒 الأمان
- ⚠️ **غيّر JWT Secret Key** في `appsettings.json` للإنتاج
- ⚠️ **غيّر كلمة مرور Admin** الافتراضية
- ✅ جميع endpoints الإدارية محمية بـ JWT

### 🗄️ قاعدة البيانات
- ✅ يتم إنشاء قاعدة البيانات تلقائياً عند التشغيل
- ✅ Migrations يتم تطبيقها تلقائياً
- ✅ Seed Data يضاف تلقائياً

### 📁 رفع الصور
- ✅ يتم حفظ الصور في `wwwroot/uploads/{folder}/`
- ✅ الحد الأقصى لحجم الصورة: 5 MB
- ✅ الصيغ المدعومة: jpg, jpeg, png, gif, svg

---

## 🛠️ أوامر مفيدة

### إنشاء Migration جديد
```powershell
dotnet ef migrations add MigrationName
```

### تحديث قاعدة البيانات
```powershell
dotnet ef database update
```

### حذف آخر Migration
```powershell
dotnet ef migrations remove
```

### حذف قاعدة البيانات
```powershell
dotnet ef database drop
```

### إعادة إنشاء قاعدة البيانات من الصفر
```powershell
dotnet ef database drop
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 📞 الدعم

إذا واجهت أي مشاكل:

1. تأكد من تشغيل SQL Server
2. تحقق من Connection String
3. تأكد من تثبيت .NET 8 SDK
4. راجع Logs في Console

---

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام الشخصي والتجاري.

---

## 🎉 استمتع بالتطوير!

تم بناء هذا المشروع باحترافية عالية ليكون نقطة انطلاق قوية لموقع Portfolio الخاص بك.

**Happy Coding! 💻✨**
