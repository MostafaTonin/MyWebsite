
namespace Portfolio.Api.Entities;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string Role { get; set; } = "User"; // Visitor, User, Writer, Admin
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<RefreshToken> RefreshTokens { get; set; } = new();
    public ICollection<BlogPost> Posts { get; set; } = new List<BlogPost>();
    public ICollection<BlogComment> Comments { get; set; } = new List<BlogComment>();
    public ICollection<BlogPostLike> PostLikes { get; set; } = new List<BlogPostLike>();
    public ICollection<BlogCommentLike> CommentLikes { get; set; } = new List<BlogCommentLike>();
}
