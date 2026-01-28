using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.DTOs;

public class ProjectImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? AltTextAr { get; set; }
    public string? AltTextEn { get; set; }
}

public class ProjectDto
{
    public int Id { get; set; }
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string DescriptionAr { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string TechnologyStack { get; set; } = string.Empty;
    public string? ProjectUrl { get; set; }
    public string? GithubUrl { get; set; }
    public DateTime CreatedDate { get; set; }
    
    public string Category { get; set; } = "Other";
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
    public bool ShowOnHome { get; set; }

    public List<ProjectImageDto> Images { get; set; } = new();
    
    // For backwards compatibility/convenience
    public List<string> ImageUrls => Images.Select(i => i.ImageUrl).ToList();
}

public class CreateProjectDto
{
    [Required]
    public string TitleAr { get; set; } = string.Empty;

    [Required]
    public string TitleEn { get; set; } = string.Empty;

    [Required]
    public string DescriptionAr { get; set; } = string.Empty;

    [Required]
    public string DescriptionEn { get; set; } = string.Empty;

    public string ClientName { get; set; } = string.Empty;
    public string TechnologyStack { get; set; } = string.Empty;
    public string? ProjectUrl { get; set; }
    public string? GithubUrl { get; set; }
    
    public string Category { get; set; } = "Other";
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
    public bool ShowOnHome { get; set; } = true;

    public List<string> ImageUrls { get; set; } = new();
}
