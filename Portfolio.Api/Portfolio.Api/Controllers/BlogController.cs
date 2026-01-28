using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.DTOs;
using Portfolio.Api.Interfaces;
using System.Security.Claims;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BlogController : ControllerBase
{
    private readonly IBlogService _blogService;

    public BlogController(IBlogService blogService)
    {
        _blogService = blogService;
    }

    private int? CurrentUserId => int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : null;

    [HttpGet]
    [ResponseCache(Duration = 60, VaryByQueryKeys = new[] { "page", "pageSize", "category", "search" })]
    public async Task<ActionResult> GetPosts(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10, 
        [FromQuery] string? category = null, 
        [FromQuery] string? search = null)
    {
        var result = await _blogService.GetPostsAsync(page, pageSize, category, search);
        return Ok(new { posts = result.Posts, totalCount = result.TotalCount });
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<BlogPostDto>> GetBySlug(string slug)
    {
        var post = await _blogService.GetPostBySlugAsync(slug, CurrentUserId);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<BlogCategoryDto>>> GetCategories()
    {
        return Ok(await _blogService.GetActiveCategoriesAsync());
    }

    // --- Admin/Writer Endpoints ---

    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin,Writer")]
    public async Task<ActionResult<IEnumerable<BlogPostDto>>> GetAllAdmin()
    {
        return Ok(await _blogService.GetAllPostsAdminAsync());
    }

    [HttpGet("admin/{id}")]
    [Authorize(Roles = "Admin,Writer")]
    public async Task<ActionResult<BlogPostDto>> GetByIdAdmin(int id)
    {
        var post = await _blogService.GetPostByIdAsync(id);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Writer")]
    public async Task<ActionResult<BlogPostDto>> Create([FromBody] CreateBlogPostDto dto)
    {
        var authorId = CurrentUserId ?? 1; // Fallback to main admin if something weird happens
        var post = await _blogService.CreatePostAsync(dto, authorId);
        return CreatedAtAction(nameof(GetByIdAdmin), new { id = post.Id }, post);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Writer")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateBlogPostDto dto)
    {
        await _blogService.UpdatePostAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _blogService.DeletePostAsync(id);
        return NoContent();
    }

    [HttpGet("admin/categories")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<BlogCategoryDto>>> GetCategoriesAdmin()
    {
        return Ok(await _blogService.GetAllCategoriesAdminAsync());
    }

    [HttpPost("categories")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BlogCategoryDto>> CreateCategory([FromBody] CreateBlogCategoryDto dto)
    {
        var category = await _blogService.CreateCategoryAsync(dto);
        return Ok(category);
    }

    [HttpPut("categories/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CreateBlogCategoryDto dto)
    {
        await _blogService.UpdateCategoryAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("categories/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        await _blogService.DeleteCategoryAsync(id);
        return NoContent();
    }

    // --- Engagement ---

    [HttpPost("{id}/like")]
    [Authorize] // Requires login to like
    public async Task<IActionResult> Like(int id)
    {
        var result = await _blogService.LikePostAsync(id, CurrentUserId!.Value);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpPost("{id}/dislike")]
    public async Task<IActionResult> Dislike(int id)
    {
        var result = await _blogService.DislikePostAsync(id);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpPost("{id}/comments")]
    public async Task<ActionResult<BlogCommentDto>> AddComment(int id, [FromBody] CreateCommentDto dto)
    {
        // Allow anonymous comments only if AuthorName is provided, otherwise require Auth
        var comment = await _blogService.AddCommentAsync(id, dto, CurrentUserId);
        if (comment == null) return NotFound();
        return Ok(comment);
    }

    [HttpDelete("comments/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment(int id)
    {
        bool isAdmin = User.IsInRole("Admin");
        var result = await _blogService.DeleteCommentAsync(id, CurrentUserId, isAdmin);
        if (!result) return Forbid();
        return NoContent();
    }

    [HttpPost("comments/{id}/like")]
    [Authorize]
    public async Task<IActionResult> LikeComment(int id)
    {
        var result = await _blogService.LikeCommentAsync(id, CurrentUserId!.Value);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpPost("comments/{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveComment(int id, [FromQuery] bool approve = true)
    {
        var result = await _blogService.ApproveCommentAsync(id, approve);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpGet("admin/{postId}/comments")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<BlogCommentDto>>> GetCommentsAdmin(int postId)
    {
        return Ok(await _blogService.GetPostCommentsAdminAsync(postId));
    }
}
