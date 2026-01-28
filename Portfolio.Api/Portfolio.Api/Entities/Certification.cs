using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.Entities;

public class Certification
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string TitleAr { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string TitleEn { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string IssuerAr { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string IssuerEn { get; set; } = string.Empty;

    // PlatformType (Cisco | Addison | ProgrammingAdvices | Other)
    [MaxLength(100)]
    public string PlatformType { get; set; } = "Other";
    
    [MaxLength(200)]
    public string? CustomPlatformName { get; set; }
    
    public string? PlatformLogoUrl { get; set; }
    public string? CertificateUrl { get; set; }
    
    public DateTime IssueDate { get; set; }
    
    [MaxLength(100)]
    public string Category { get; set; } = "Course"; // Course, Certificate, Bootcamp
    
    public bool IsFeatured { get; set; }
    public bool ShowOnHome { get; set; } = true;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
