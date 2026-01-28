
namespace Portfolio.Api.Entities;

public class Skill
{
    public int Id { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public int Proficiency { get; set; } // 0-100
    public string IconUrl { get; set; } = string.Empty;
    public string Category { get; set; } = "Backend"; // e.g., Backend, Frontend, Mobile, etc.
    public int YearsOfUse { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
