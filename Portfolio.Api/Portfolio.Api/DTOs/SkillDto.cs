using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.DTOs;

public class SkillDto
{
    public int Id { get; set; }

    [Required]
    public string NameAr { get; set; } = string.Empty;

    [Required]
    public string NameEn { get; set; } = string.Empty;

    [Range(0, 100)]
    public int Proficiency { get; set; }

    public string IconUrl { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int YearsOfUse { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class CreateSkillDto
{
    [Required]
    public string NameAr { get; set; } = string.Empty;

    [Required]
    public string NameEn { get; set; } = string.Empty;

    [Range(0, 100)]
    public int Proficiency { get; set; }

    public string IconUrl { get; set; } = string.Empty;
    public string Category { get; set; } = "Backend";
    public int YearsOfUse { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
