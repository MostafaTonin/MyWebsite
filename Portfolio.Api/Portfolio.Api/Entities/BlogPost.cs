
namespace Portfolio.Api.Entities;

public class BlogPost
{
    public int Id { get; set; }
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string ContentAr { get; set; } = string.Empty;
    public string ContentEn { get; set; } = string.Empty;
    public string SummaryAr { get; set; } = string.Empty;
    public string SummaryEn { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? VideoUrl { get; set; }
    public string? AudioUrl { get; set; }
    public string PostType { get; set; } = "text"; // text, video, audio, short
    public bool IsDraft { get; set; } = false;
    public DateTime PublishedDate { get; set; } = DateTime.UtcNow;
    public int ViewCount { get; set; }
    public bool IsPublished { get; set; }
    public bool IsDeleted { get; set; }
    public int ReadingTimeInMinutes { get; set; }
    public string SeoTitleEn { get; set; } = string.Empty;
    public string SeoTitleAr { get; set; } = string.Empty;
    public string SeoDescriptionEn { get; set; } = string.Empty;
    public string SeoDescriptionAr { get; set; } = string.Empty;

    public int CategoryId { get; set; }
    public BlogCategory Category { get; set; } = null!;

    public int? AuthorId { get; set; }
    public User? Author { get; set; }

    public int LikeCount { get; set; }
    public int DislikeCount { get; set; }
    public ICollection<BlogComment> Comments { get; set; } = new List<BlogComment>();
    public ICollection<BlogPostLike> Likes { get; set; } = new List<BlogPostLike>();
}
