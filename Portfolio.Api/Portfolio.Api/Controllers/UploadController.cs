using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Helpers;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class UploadController : ControllerBase
{
    private readonly ILogger<UploadController> _logger;

    public UploadController(ILogger<UploadController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// رفع صورة (Admin فقط)
    /// </summary>
    [HttpPost("image")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage(IFormFile file, [FromQuery] string folder = "general")
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "الملف فارغ" });

            var imageUrl = await FileUploadHelper.SaveImageAsync(file, folder);
            
            _logger.LogInformation("تم رفع صورة جديدة: {ImageUrl}", imageUrl);
            
            return Ok(new { imageUrl, message = "تم رفع الصورة بنجاح" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "خطأ أثناء رفع الصورة");
            return StatusCode(500, new { message = "حدث خطأ أثناء رفع الصورة" });
        }
    }

    /// <summary>
    /// حذف صورة (Admin فقط)
    /// </summary>
    [HttpDelete("image")]
    public IActionResult DeleteImage([FromQuery] string imageUrl)
    {
        try
        {
            if (string.IsNullOrEmpty(imageUrl))
                return BadRequest(new { message = "مسار الصورة مطلوب" });

            FileUploadHelper.DeleteImage(imageUrl);
            
            _logger.LogInformation("تم حذف الصورة: {ImageUrl}", imageUrl);
            
            return Ok(new { message = "تم حذف الصورة بنجاح" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "خطأ أثناء حذف الصورة");
            return StatusCode(500, new { message = "حدث خطأ أثناء حذف الصورة" });
        }
    }
}
