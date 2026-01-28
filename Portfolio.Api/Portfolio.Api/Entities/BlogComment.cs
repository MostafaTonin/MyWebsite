
namespace Portfolio.Api.Entities;

public class BlogComment
{
    public int Id { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsApproved { get; set; } = true;
    public bool IsDeleted { get; set; } = false;
    public int ReportCount { get; set; }
    
    public int? UserId { get; set; }
    public User? User { get; set; }
    
    public int PostId { get; set; }
    public BlogPost Post { get; set; } = null!;

    public int? ParentCommentId { get; set; }
    public BlogComment? ParentComment { get; set; }
    public ICollection<BlogComment> Replies { get; set; } = new List<BlogComment>();

    public int LikeCount { get; set; }
    public ICollection<BlogCommentLike> Likes { get; set; } = new List<BlogCommentLike>();
}
