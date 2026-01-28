namespace Portfolio.Api.Helpers;

/// <summary>
/// Helper لرفع الملفات
/// </summary>
public static class FileUploadHelper
{
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".svg" };
    private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

    /// <summary>
    /// حفظ الصورة في المجلد المحدد
    /// </summary>
    public static async Task<string> SaveImageAsync(IFormFile file, string folder)
    {
        // التحقق من الملف
        if (file == null || file.Length == 0)
            throw new ArgumentException("الملف فارغ");

        if (file.Length > MaxFileSize)
            throw new ArgumentException("حجم الملف أكبر من المسموح (5 MB)");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new ArgumentException("نوع الملف غير مدعوم");

        // إنشاء اسم فريد للملف
        var fileName = $"{Guid.NewGuid()}{extension}";
        var uploadsFolder = Path.Combine("wwwroot", "uploads", folder);
        
        // إنشاء المجلد إذا لم يكن موجوداً
        Directory.CreateDirectory(uploadsFolder);

        var filePath = Path.Combine(uploadsFolder, fileName);

        // حفظ الملف
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // إرجاع المسار النسبي
        return $"/uploads/{folder}/{fileName}";
    }

    /// <summary>
    /// حذف الصورة
    /// </summary>
    public static void DeleteImage(string imageUrl)
    {
        if (string.IsNullOrEmpty(imageUrl)) return;

        var filePath = Path.Combine("wwwroot", imageUrl.TrimStart('/'));
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }
}
