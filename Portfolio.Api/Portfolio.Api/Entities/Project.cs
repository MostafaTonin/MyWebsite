
namespace Portfolio.Api.Entities;

public class Project
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
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public string Category { get; set; } = "Other"; // Web, Mobile, Desktop, etc.
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
    public bool ShowOnHome { get; set; } = true;
    
    public ICollection<ProjectImage> Images { get; set; } = new List<ProjectImage>();
}
