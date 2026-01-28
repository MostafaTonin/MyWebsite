using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.DTOs;

public class BlogPostDto
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
    public string PostType { get; set; } = "text";
    public bool IsDraft { get; set; }
    public DateTime PublishedDate { get; set; }
    public int ViewCount { get; set; }
    public bool IsPublished { get; set; }
    public int ReadingTimeInMinutes { get; set; }
    public string SeoTitleEn { get; set; } = string.Empty;
    public string SeoTitleAr { get; set; } = string.Empty;
    public string SeoDescriptionEn { get; set; } = string.Empty;
    public string SeoDescriptionAr { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryNameAr { get; set; } = string.Empty;
    public string CategoryNameEn { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;

    public int? AuthorId { get; set; }
    public string? AuthorName { get; set; }
    public int LikeCount { get; set; }
    public int DislikeCount { get; set; }
    public bool IsLikedByCurrentUser { get; set; }
    public List<BlogCommentDto> Comments { get; set; } = new();
}

public class CreateBlogPostDto
{
    [Required] public string TitleAr { get; set; } = string.Empty;
    [Required] public string TitleEn { get; set; } = string.Empty;
    [Required] public string ContentAr { get; set; } = string.Empty;
    [Required] public string ContentEn { get; set; } = string.Empty;
    public string SummaryAr { get; set; } = string.Empty;
    public string SummaryEn { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? VideoUrl { get; set; }
    public string? AudioUrl { get; set; }
    public string PostType { get; set; } = "text";
    public bool IsPublished { get; set; }
    public bool IsDraft { get; set; }
    public int ReadingTimeInMinutes { get; set; }
    public string SeoTitleEn { get; set; } = string.Empty;
    public string SeoTitleAr { get; set; } = string.Empty;
    public string SeoDescriptionEn { get; set; } = string.Empty;
    public string SeoDescriptionAr { get; set; } = string.Empty;
    [Required] public int CategoryId { get; set; }
}

public class BlogCategoryDto
{
    public int Id { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class CreateBlogCategoryDto
{
    [Required] public string NameAr { get; set; } = string.Empty;
    [Required] public string NameEn { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
