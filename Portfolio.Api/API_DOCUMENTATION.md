# 📚 API Documentation

## 🔐 Authentication

### Login
احصل على JWT Token لاستخدامه في الطلبات المحمية.

**Endpoint:** `POST /api/Auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImp0aSI6IjEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMiIsImV4cCI6MTcwNjA1MjAwMCwiaXNzIjoiUG9ydGZvbGlvQXBpIiwiYXVkIjoiUG9ydGZvbGlvQ2xpZW50In0.signature",
  "message": "تم تسجيل الدخول بنجاح"
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "اسم المستخدم أو كلمة المرور غير صحيحة"
}
```

---

## 💪 Skills API

### Get All Skills
**Endpoint:** `GET /api/Skills`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nameAr": "C#",
    "nameEn": "C#",
    "proficiency": 90,
    "iconUrl": "/images/skills/csharp.png"
  }
]
```

### Get Skill By ID
**Endpoint:** `GET /api/Skills/{id}`

### Create Skill (Admin Only)
**Endpoint:** `POST /api/Skills`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nameAr": "React",
  "nameEn": "React",
  "proficiency": 85,
  "iconUrl": "/images/skills/react.png"
}
```

### Update Skill (Admin Only)
**Endpoint:** `PUT /api/Skills/{id}`

### Delete Skill (Admin Only)
**Endpoint:** `DELETE /api/Skills/{id}`

---

## 📁 Projects API

### Get All Projects
**Endpoint:** `GET /api/Projects`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "titleAr": "نظام إدارة المحتوى",
    "titleEn": "Content Management System",
    "descriptionAr": "نظام متكامل لإدارة المحتوى",
    "descriptionEn": "Complete content management system",
    "clientName": "شركة ABC",
    "technologyStack": "ASP.NET Core, React, SQL Server",
    "projectUrl": "https://example.com",
    "githubUrl": "https://github.com/user/repo",
    "createdDate": "2024-01-15T10:30:00Z",
    "imageUrls": [
      "/uploads/projects/img1.jpg",
      "/uploads/projects/img2.jpg"
    ]
  }
]
```

### Create Project (Admin Only)
**Endpoint:** `POST /api/Projects`

**Request Body:**
```json
{
  "titleAr": "تطبيق الجوال",
  "titleEn": "Mobile App",
  "descriptionAr": "تطبيق جوال متقدم",
  "descriptionEn": "Advanced mobile application",
  "clientName": "Client XYZ",
  "technologyStack": "Flutter, Firebase",
  "projectUrl": "https://app.example.com",
  "githubUrl": "https://github.com/user/mobile-app",
  "imageUrls": [
    "/uploads/projects/mobile1.jpg",
    "/uploads/projects/mobile2.jpg"
  ]
}
```

---

## 📝 Blog API

### Get All Posts (with Pagination)
**Endpoint:** `GET /api/Blog?page=1&pageSize=10`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "titleAr": "مقدمة في ASP.NET Core",
    "titleEn": "Introduction to ASP.NET Core",
    "contentAr": "محتوى المقال بالعربية...",
    "contentEn": "Article content in English...",
    "imageUrl": "/uploads/blog/post1.jpg",
    "publishedDate": "2024-01-20T14:00:00Z",
    "viewCount": 150,
    "categoryId": 1,
    "categoryNameAr": "برمجة",
    "categoryNameEn": "Programming"
  }
]
```

### Get Post By ID
**Endpoint:** `GET /api/Blog/{id}`

**Note:** يزيد عدد المشاهدات تلقائياً

### Get All Categories
**Endpoint:** `GET /api/Blog/categories`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nameAr": "برمجة",
    "nameEn": "Programming"
  }
]
```

### Create Post (Admin Only)
**Endpoint:** `POST /api/Blog`

**Request Body:**
```json
{
  "titleAr": "عنوان المقال",
  "titleEn": "Article Title",
  "contentAr": "محتوى المقال...",
  "contentEn": "Article content...",
  "imageUrl": "/uploads/blog/image.jpg",
  "categoryId": 1
}
```

---

## 🛠️ Services API

### Get All Services
**Endpoint:** `GET /api/Services`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "titleAr": "تطوير تطبيقات الويب",
    "titleEn": "Web Application Development",
    "descriptionAr": "تطوير تطبيقات ويب احترافية",
    "descriptionEn": "Professional web application development",
    "iconUrl": "/images/services/web.png"
  }
]
```

### Create Service (Admin Only)
**Endpoint:** `POST /api/Services`

**Request Body:**
```json
{
  "titleAr": "استشارات تقنية",
  "titleEn": "Technical Consulting",
  "descriptionAr": "استشارات تقنية متخصصة",
  "descriptionEn": "Specialized technical consulting",
  "iconUrl": "/images/services/consulting.png"
}
```

---

## 👤 About API

### Get All About Sections
**Endpoint:** `GET /api/About`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "titleAr": "من أنا",
    "titleEn": "About Me",
    "descriptionAr": "مطور برمجيات محترف...",
    "descriptionEn": "Professional software developer...",
    "imageUrl": "/images/about/profile.jpg",
    "displayOrder": 1,
    "isActive": true
  }
]
```

---

## 📧 Contact API

### Send Contact Message (Public)
**Endpoint:** `POST /api/Contact`

**Request Body:**
```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "subject": "استفسار عن الخدمات",
  "message": "أود الاستفسار عن..."
}
```

**Response (200 OK):**
```json
{
  "message": "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً"
}
```

### Get All Messages (Admin Only)
**Endpoint:** `GET /api/Contact`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "subject": "استفسار عن الخدمات",
    "message": "أود الاستفسار عن...",
    "sentDate": "2024-01-22T10:15:00Z",
    "isRead": false
  }
]
```

### Mark Message as Read (Admin Only)
**Endpoint:** `PATCH /api/Contact/{id}/mark-read`

---

## 📤 Upload API

### Upload Image (Admin Only)
**Endpoint:** `POST /api/Upload/image?folder=projects`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: (binary file)

**Response (200 OK):**
```json
{
  "imageUrl": "/uploads/projects/abc123.jpg",
  "message": "تم رفع الصورة بنجاح"
}
```

**Supported Formats:** jpg, jpeg, png, gif, svg  
**Max Size:** 5 MB

### Delete Image (Admin Only)
**Endpoint:** `DELETE /api/Upload/image?imageUrl=/uploads/projects/abc123.jpg`

---

## 🌍 Localization

أرسل اللغة المطلوبة في Header:

```http
Accept-Language: ar
```
أو
```http
Accept-Language: en
```

**Default:** Arabic (ar)

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "البيانات المدخلة غير صحيحة",
  "details": "Validation error details..."
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "غير مصرح بالوصول",
  "details": "Unauthorized access"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "العنصر غير موجود",
  "details": "Item not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "حدث خطأ في الخادم",
  "details": "Internal server error details..."
}
```

---

## 📝 Notes

- جميع التواريخ بصيغة ISO 8601 (UTC)
- جميع الـ IDs من نوع Integer
- الـ Pagination يبدأ من صفحة 1
- الحد الأقصى لـ PageSize: 100
