
using System.Text.Json.Serialization;

namespace Portfolio.Api.Entities;

public class ProjectImage
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? AltTextAr { get; set; }
    public string? AltTextEn { get; set; }
    
    public int ProjectId { get; set; }
    [JsonIgnore]
    public Project Project { get; set; } = null!;
}
