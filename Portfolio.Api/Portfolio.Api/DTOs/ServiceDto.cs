using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.DTOs;

public class ServiceDto
{
    public int Id { get; set; }
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string DescriptionAr { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public bool ShowOnHome { get; set; }
}

public class CreateServiceDto
{
    [Required]
    public string TitleAr { get; set; } = string.Empty;

    [Required]
    public string TitleEn { get; set; } = string.Empty;

    [Required]
    public string DescriptionAr { get; set; } = string.Empty;

    [Required]
    public string DescriptionEn { get; set; } = string.Empty;

    public string IconUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public bool ShowOnHome { get; set; } = true;
}
