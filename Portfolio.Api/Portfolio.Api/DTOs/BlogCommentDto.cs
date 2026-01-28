
using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.DTOs;

public class BlogCommentDto
{
    public int Id { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsApproved { get; set; }
    public bool IsDeleted { get; set; }
    public int LikeCount { get; set; }
    public bool IsLikedByCurrentUser { get; set; }
    public int? UserId { get; set; }
    public int? ParentCommentId { get; set; }
    public List<BlogCommentDto> Replies { get; set; } = new();
}

public class CreateCommentDto
{
    public string? AuthorName { get; set; } // Optional if UserId is present

    [Required]
    public string Content { get; set; } = string.Empty;

    public int? ParentCommentId { get; set; }
}

public class CommentModerationDto
{
    public bool IsApproved { get; set; }
}
