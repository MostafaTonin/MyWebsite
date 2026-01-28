using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.DTOs;
using Portfolio.Api.Interfaces;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CertificationsController : ControllerBase
{
    private readonly ICertificationService _certificationService;
    private readonly IFileService _fileService;
    private readonly ILogger<CertificationsController> _logger;

    public CertificationsController(
        ICertificationService certificationService, 
        IFileService fileService,
        ILogger<CertificationsController> logger)
    {
        _certificationService = certificationService;
        _fileService = fileService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _certificationService.GetAllCertificationsAsync();
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured()
    {
        var result = await _certificationService.GetFeaturedCertificationsAsync();
        return Ok(result);
    }

    [HttpGet("by-platform/{type}")]
    public async Task<IActionResult> GetByPlatform(string type)
    {
        var result = await _certificationService.GetCertificationsByPlatformAsync(type);
        return Ok(result);
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminAll()
    {
        var result = await _certificationService.GetAdminCertificationsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _certificationService.GetCertificationByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCertificationDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _certificationService.CreateCertificationAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCertificationDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            await _certificationService.UpdateCertificationAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _certificationService.DeleteCertificationAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPatch("{id}/toggle")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        try
        {
            await _certificationService.ToggleCertificationStatusAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("upload")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        try
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".svg" };
            var path = await _fileService.SaveFileAsync(file, allowedExtensions);
            return Ok(new { url = path });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
