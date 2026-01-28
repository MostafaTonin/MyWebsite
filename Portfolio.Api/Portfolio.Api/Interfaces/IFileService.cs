namespace Portfolio.Api.Interfaces;

public interface IFileService
{
    Task<string> SaveFileAsync(IFormFile file, string[] allowedExtensions);
    void DeleteFile(string filePath);
}
