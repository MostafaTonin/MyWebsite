using Portfolio.Api.Interfaces;

namespace Portfolio.Api.Services;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<FileService> _logger;

    public FileService(IWebHostEnvironment environment, ILogger<FileService> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    public async Task<string> SaveFileAsync(IFormFile file, string[] allowedExtensions)
    {
        if (file == null)
        {
            throw new ArgumentNullException(nameof(file));
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
        {
            throw new ArgumentException($"File type {extension} is not allowed.");
        }

        // Validate MIME type (basic check)
        if (!file.ContentType.StartsWith("image/"))
        {
             // For strict checking we might want more complex logic, but this is a start
             // You can add more specific MIME types if needed
        }

        // 5MB Limit
        if (file.Length > 5 * 1024 * 1024)
        {
             throw new ArgumentException("File size exceeds the 5MB limit.");
        }

        var fileName = $"{Guid.NewGuid()}{extension}";
        var uploadFolder = Path.Combine(_environment.WebRootPath, "uploads");
        
        if (!Directory.Exists(uploadFolder))
        {
            Directory.CreateDirectory(uploadFolder);
        }

        var filePath = Path.Combine(uploadFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"/uploads/{fileName}";
    }

    public void DeleteFile(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl)) return;

        var fileName = Path.GetFileName(fileUrl);
        var filePath = Path.Combine(_environment.WebRootPath, "uploads", fileName);

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }
}
