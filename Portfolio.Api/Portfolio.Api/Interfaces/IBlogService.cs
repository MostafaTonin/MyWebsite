using Portfolio.Api.DTOs;

namespace Portfolio.Api.Interfaces;

public interface IBlogService
{
    // Public Methods
    Task<(IEnumerable<BlogPostDto> Posts, int TotalCount)> GetPostsAsync(int page = 1, int pageSize = 10, string? categorySlug = null, string? searchTerm = null);
    Task<BlogPostDto?> GetPostBySlugAsync(string slug, int? currentUserId = null);
    Task<IEnumerable<BlogCategoryDto>> GetActiveCategoriesAsync();
    
    // Admin Methods
    Task<IEnumerable<BlogPostDto>> GetAllPostsAdminAsync();
    Task<BlogPostDto?> GetPostByIdAsync(int id);
    Task<BlogPostDto> CreatePostAsync(CreateBlogPostDto dto, int authorId);
    Task UpdatePostAsync(int id, CreateBlogPostDto dto);
    Task DeletePostAsync(int id);
    
    Task<IEnumerable<BlogCategoryDto>> GetAllCategoriesAdminAsync();
    Task<BlogCategoryDto> CreateCategoryAsync(CreateBlogCategoryDto dto);
    Task UpdateCategoryAsync(int id, CreateBlogCategoryDto dto);
    Task DeleteCategoryAsync(int id);

    // Engagement
    Task<bool> LikePostAsync(int postId, int userId);
    Task<bool> DislikePostAsync(int postId); // Keeping for now, though social usually just has like
    Task<BlogCommentDto?> AddCommentAsync(int postId, CreateCommentDto dto, int? userId = null);
    Task<bool> DeleteCommentAsync(int id, int? userId = null, bool isAdmin = false);
    Task<bool> LikeCommentAsync(int commentId, int userId);
    Task<bool> ApproveCommentAsync(int id, bool approve);
    Task<IEnumerable<BlogCommentDto>> GetPostCommentsAdminAsync(int postId);
}
