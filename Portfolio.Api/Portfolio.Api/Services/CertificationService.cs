using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs;
using Portfolio.Api.Entities;
using Portfolio.Api.Interfaces;

namespace Portfolio.Api.Services;

public class CertificationService : ICertificationService
{
    private readonly PortfolioDbContext _context;
    private readonly ILogger<CertificationService> _logger;

    public CertificationService(PortfolioDbContext context, ILogger<CertificationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<CertificationDto>> GetAllCertificationsAsync()
    {
        return await _context.Certifications
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ThenByDescending(c => c.IssueDate)
            .Select(c => MapToDto(c))
            .ToListAsync();
    }

    public async Task<IEnumerable<CertificationDto>> GetAdminCertificationsAsync()
    {
        return await _context.Certifications
            .OrderBy(c => c.DisplayOrder)
            .ThenByDescending(c => c.IssueDate)
            .Select(c => MapToDto(c))
            .ToListAsync();
    }

    public async Task<IEnumerable<CertificationDto>> GetFeaturedCertificationsAsync()
    {
        return await _context.Certifications
            .Where(c => c.IsActive && c.IsFeatured)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => MapToDto(c))
            .ToListAsync();
    }

    public async Task<IEnumerable<CertificationDto>> GetCertificationsByPlatformAsync(string platformType)
    {
        return await _context.Certifications
            .Where(c => c.IsActive && c.PlatformType == platformType)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => MapToDto(c))
            .ToListAsync();
    }

    public async Task<CertificationDto?> GetCertificationByIdAsync(int id)
    {
        var certification = await _context.Certifications.FindAsync(id);
        return certification == null ? null : MapToDto(certification);
    }

    public async Task<CertificationDto> CreateCertificationAsync(CreateCertificationDto dto)
    {
        var certification = new Certification
        {
            TitleAr = dto.TitleAr,
            TitleEn = dto.TitleEn,
            IssuerAr = dto.IssuerAr,
            IssuerEn = dto.IssuerEn,
            PlatformType = dto.PlatformType,
            CustomPlatformName = dto.CustomPlatformName,
            PlatformLogoUrl = dto.PlatformLogoUrl,
            CertificateUrl = dto.CertificateUrl,
            IssueDate = dto.IssueDate,
            Category = dto.Category,
            IsFeatured = dto.IsFeatured,
            ShowOnHome = dto.ShowOnHome,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.Certifications.Add(certification);
        await _context.SaveChangesAsync();

        return MapToDto(certification);
    }

    public async Task UpdateCertificationAsync(int id, UpdateCertificationDto dto)
    {
        var certification = await _context.Certifications.FindAsync(id);
        if (certification == null)
            throw new KeyNotFoundException($"Certification with ID {id} not found");

        certification.TitleAr = dto.TitleAr;
        certification.TitleEn = dto.TitleEn;
        certification.IssuerAr = dto.IssuerAr;
        certification.IssuerEn = dto.IssuerEn;
        certification.PlatformType = dto.PlatformType;
        certification.CustomPlatformName = dto.CustomPlatformName;
        certification.PlatformLogoUrl = dto.PlatformLogoUrl;
        certification.CertificateUrl = dto.CertificateUrl;
        certification.IssueDate = dto.IssueDate;
        certification.Category = dto.Category;
        certification.IsFeatured = dto.IsFeatured;
        certification.ShowOnHome = dto.ShowOnHome;
        certification.DisplayOrder = dto.DisplayOrder;
        certification.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteCertificationAsync(int id)
    {
        var certification = await _context.Certifications.FindAsync(id);
        if (certification == null)
            throw new KeyNotFoundException($"Certification with ID {id} not found");

        _context.Certifications.Remove(certification);
        await _context.SaveChangesAsync();
    }

    public async Task ToggleCertificationStatusAsync(int id)
    {
        var certification = await _context.Certifications.FindAsync(id);
        if (certification == null)
            throw new KeyNotFoundException($"Certification with ID {id} not found");

        certification.IsActive = !certification.IsActive;
        await _context.SaveChangesAsync();
    }

    private static CertificationDto MapToDto(Certification c)
    {
        return new CertificationDto
        {
            Id = c.Id,
            TitleAr = c.TitleAr,
            TitleEn = c.TitleEn,
            IssuerAr = c.IssuerAr,
            IssuerEn = c.IssuerEn,
            PlatformType = c.PlatformType,
            CustomPlatformName = c.CustomPlatformName,
            PlatformLogoUrl = c.PlatformLogoUrl,
            CertificateUrl = c.CertificateUrl,
            IssueDate = c.IssueDate,
            Category = c.Category,
            IsFeatured = c.IsFeatured,
            ShowOnHome = c.ShowOnHome,
            DisplayOrder = c.DisplayOrder,
            IsActive = c.IsActive
        };
    }
}
