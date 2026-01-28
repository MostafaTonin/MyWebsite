
namespace Portfolio.Api.Entities;

public class SocialLink
{
    public int Id { get; set; }
    public string Platform { get; set; } = string.Empty; // e.g., GitHub, LinkedIn
    public string Url { get; set; } = string.Empty;
    public string IconName { get; set; } = string.Empty; // Lucide icon name
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
