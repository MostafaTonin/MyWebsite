
using System.Text.Json.Serialization;

namespace Portfolio.Api.Entities;

public class BlogCategory
{
    public int Id { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    [JsonIgnore]
    public ICollection<BlogPost> Posts { get; set; } = new List<BlogPost>();
}
