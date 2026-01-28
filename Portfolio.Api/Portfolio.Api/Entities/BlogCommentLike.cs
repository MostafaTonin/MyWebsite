
namespace Portfolio.Api.Entities;

public class BlogCommentLike
{
    public int Id { get; set; }
    public int CommentId { get; set; }
    public BlogComment Comment { get; set; } = null!;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
