using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs;
using Portfolio.Api.Entities;
using Portfolio.Api.Interfaces;

namespace Portfolio.Api.Services;

public class BlogService : IBlogService
{
    private readonly PortfolioDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<BlogService> _logger;

    public BlogService(PortfolioDbContext context, IMapper mapper, ILogger<BlogService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<(IEnumerable<BlogPostDto> Posts, int TotalCount)> GetPostsAsync(int page = 1, int pageSize = 10, string? categorySlug = null, string? searchTerm = null)
    {
        var query = _context.BlogPosts
            .Include(bp => bp.Category)
            .Include(bp => bp.Comments)
            .Where(bp => bp.IsPublished && !bp.IsDraft)
            .AsQueryable();

        if (!string.IsNullOrEmpty(categorySlug))
        {
            query = query.Where(bp => bp.Category.Slug == categorySlug && bp.Category.IsActive);
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(bp => bp.TitleEn.Contains(searchTerm) || 
                                     bp.TitleAr.Contains(searchTerm) || 
                                     bp.SummaryEn.Contains(searchTerm) || 
                                     bp.SummaryAr.Contains(searchTerm));
        }

        var totalCount = await query.CountAsync();
        var posts = await query
            .OrderByDescending(bp => bp.PublishedDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (_mapper.Map<IEnumerable<BlogPostDto>>(posts), totalCount);
    }

    public async Task<BlogPostDto?> GetPostBySlugAsync(string slug, int? currentUserId = null)
    {
        var post = await _context.BlogPosts
            .Include(bp => bp.Category)
            .Include(bp => bp.Author)
            .Include(bp => bp.Comments)
                .ThenInclude(c => c.Replies)
            .Include(bp => bp.Likes)
            .FirstOrDefaultAsync(bp => bp.Slug == slug && bp.IsPublished);

        if (post == null) return null;

        post.ViewCount++;
        await _context.SaveChangesAsync();

        var dto = _mapper.Map<BlogPostDto>(post);
        dto.AuthorName = post.Author?.FullName ?? "Mostafa Tonin";
        
        if (currentUserId.HasValue)
        {
            dto.IsLikedByCurrentUser = post.Likes.Any(l => l.UserId == currentUserId.Value);
        }

        // Build nested tree manually
        var topLevelComments = post.Comments
            .Where(c => c.IsApproved && !c.IsDeleted && c.ParentCommentId == null)
            .OrderByDescending(c => c.CreatedAt)
            .ToList();
        
        dto.Comments = _mapper.Map<List<BlogCommentDto>>(topLevelComments);
        
        // Mark liked comments if user logged in
        if (currentUserId.HasValue)
        {
            await MarkLikedComments(dto.Comments, currentUserId.Value);
        }

        return dto;
    }

    private async Task MarkLikedComments(List<BlogCommentDto> comments, int userId)
    {
        foreach (var comment in comments)
        {
            comment.IsLikedByCurrentUser = await _context.CommentLikes.AnyAsync(l => l.CommentId == comment.Id && l.UserId == userId);
            if (comment.Replies.Any())
            {
                await MarkLikedComments(comment.Replies, userId);
            }
        }
    }

    public async Task<IEnumerable<BlogCategoryDto>> GetActiveCategoriesAsync()
    {
        var categories = await _context.BlogCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        return _mapper.Map<IEnumerable<BlogCategoryDto>>(categories);
    }

    public async Task<IEnumerable<BlogPostDto>> GetAllPostsAdminAsync()
    {
        var posts = await _context.BlogPosts
            .Include(bp => bp.Category)
            .Include(bp => bp.Author)
            .OrderByDescending(bp => bp.PublishedDate)
            .ToListAsync();

        return _mapper.Map<IEnumerable<BlogPostDto>>(posts);
    }

    public async Task<BlogPostDto?> GetPostByIdAsync(int id)
    {
        var post = await _context.BlogPosts
            .Include(bp => bp.Category)
            .FirstOrDefaultAsync(bp => bp.Id == id);

        return _mapper.Map<BlogPostDto>(post);
    }

    public async Task<BlogPostDto> CreatePostAsync(CreateBlogPostDto dto, int authorId)
    {
        var post = _mapper.Map<BlogPost>(dto);
        post.AuthorId = authorId;
        if (string.IsNullOrEmpty(post.Slug))
        {
            post.Slug = GenerateSlug(post.TitleEn);
        }

        _context.BlogPosts.Add(post);
        await _context.SaveChangesAsync();
        
        await _context.Entry(post).Reference(p => p.Category).LoadAsync();
        return _mapper.Map<BlogPostDto>(post);
    }

    public async Task UpdatePostAsync(int id, CreateBlogPostDto dto)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null) throw new KeyNotFoundException("Post not found");

        _mapper.Map(dto, post);
        if (string.IsNullOrEmpty(post.Slug))
        {
            post.Slug = GenerateSlug(post.TitleEn);
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeletePostAsync(int id)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null) throw new KeyNotFoundException("Post not found");

        post.IsDeleted = true;
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<BlogCategoryDto>> GetAllCategoriesAdminAsync()
    {
        var categories = await _context.BlogCategories
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        return _mapper.Map<IEnumerable<BlogCategoryDto>>(categories);
    }

    public async Task<BlogCategoryDto> CreateCategoryAsync(CreateBlogCategoryDto dto)
    {
        var category = _mapper.Map<BlogCategory>(dto);
        if (string.IsNullOrEmpty(category.Slug))
        {
            category.Slug = GenerateSlug(category.NameEn);
        }

        _context.BlogCategories.Add(category);
        await _context.SaveChangesAsync();
        return _mapper.Map<BlogCategoryDto>(category);
    }

    public async Task UpdateCategoryAsync(int id, CreateBlogCategoryDto dto)
    {
        var category = await _context.BlogCategories.FindAsync(id);
        if (category == null) throw new KeyNotFoundException("Category not found");

        _mapper.Map(dto, category);
        if (string.IsNullOrEmpty(category.Slug))
        {
            category.Slug = GenerateSlug(category.NameEn);
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteCategoryAsync(int id)
    {
        var category = await _context.BlogCategories.FindAsync(id);
        if (category == null) throw new KeyNotFoundException("Category not found");

        _context.BlogCategories.Remove(category);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> LikePostAsync(int postId, int userId)
    {
        var existingLike = await _context.PostLikes.FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);
        var post = await _context.BlogPosts.FindAsync(postId);
        if (post == null) return false;

        if (existingLike != null)
        {
            _context.PostLikes.Remove(existingLike);
            post.LikeCount = Math.Max(0, post.LikeCount - 1);
        }
        else
        {
            _context.PostLikes.Add(new BlogPostLike { PostId = postId, UserId = userId });
            post.LikeCount++;
        }

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DislikePostAsync(int id)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null) return false;

        post.DislikeCount++;
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<BlogCommentDto?> AddCommentAsync(int postId, CreateCommentDto dto, int? userId = null)
    {
        var post = await _context.BlogPosts.FindAsync(postId);
        if (post == null) return null;

        string authorName = dto.AuthorName ?? "Guest";
        if (userId.HasValue)
        {
            var user = await _context.Users.FindAsync(userId.Value);
            if (user != null) authorName = user.FullName;
        }

        var comment = new BlogComment
        {
            PostId = postId,
            UserId = userId,
            AuthorName = authorName,
            Content = dto.Content,
            ParentCommentId = dto.ParentCommentId,
            CreatedAt = DateTime.UtcNow,
            IsApproved = true // For now auto-approve, can be false later
        };

        _context.BlogComments.Add(comment);
        await _context.SaveChangesAsync();

        return _mapper.Map<BlogCommentDto>(comment);
    }

    public async Task<bool> DeleteCommentAsync(int id, int? userId = null, bool isAdmin = false)
    {
        var comment = await _context.BlogComments.FindAsync(id);
        if (comment == null) return false;

        if (!isAdmin && comment.UserId != userId) return false;

        comment.IsDeleted = true;
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> LikeCommentAsync(int commentId, int userId)
    {
        var existingLike = await _context.CommentLikes.FirstOrDefaultAsync(l => l.CommentId == commentId && l.UserId == userId);
        var comment = await _context.BlogComments.FindAsync(commentId);
        if (comment == null) return false;

        if (existingLike != null)
        {
            _context.CommentLikes.Remove(existingLike);
            comment.LikeCount = Math.Max(0, comment.LikeCount - 1);
        }
        else
        {
            _context.CommentLikes.Add(new BlogCommentLike { CommentId = commentId, UserId = userId });
            comment.LikeCount++;
        }

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> ApproveCommentAsync(int id, bool approve)
    {
        var comment = await _context.BlogComments.FindAsync(id);
        if (comment == null) return false;

        comment.IsApproved = approve;
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<BlogCommentDto>> GetPostCommentsAdminAsync(int postId)
    {
        var comments = await _context.BlogComments
            .Where(c => c.PostId == postId && !c.IsDeleted)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return _mapper.Map<IEnumerable<BlogCommentDto>>(comments);
    }

    private string GenerateSlug(string text)
    {
        return text.ToLower().Replace(" ", "-").Replace("/", "-");
    }
}
