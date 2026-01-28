using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.DTOs;

public class CertificationDto
{
    public int Id { get; set; }
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string IssuerAr { get; set; } = string.Empty;
    public string IssuerEn { get; set; } = string.Empty;
    
    public string PlatformType { get; set; } = "Other";
    public string? CustomPlatformName { get; set; }
    public string? PlatformLogoUrl { get; set; }
    public string? CertificateUrl { get; set; }
    
    public DateTime IssueDate { get; set; }
    public string Category { get; set; } = string.Empty;
    
    public bool IsFeatured { get; set; }
    public bool ShowOnHome { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class CreateCertificationDto
{
    [Required]
    public string TitleAr { get; set; } = string.Empty;
    [Required]
    public string TitleEn { get; set; } = string.Empty;
    [Required]
    public string IssuerAr { get; set; } = string.Empty;
    [Required]
    public string IssuerEn { get; set; } = string.Empty;
    
    [Required]
    public string PlatformType { get; set; } = "Other";
    public string? CustomPlatformName { get; set; }
    public string? PlatformLogoUrl { get; set; }
    public string? CertificateUrl { get; set; }

    [Required]
    public DateTime IssueDate { get; set; }
    
    [Required]
    public string Category { get; set; } = "Course";
    
    public bool IsFeatured { get; set; }
    public bool ShowOnHome { get; set; } = true;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateCertificationDto : CreateCertificationDto
{
}
