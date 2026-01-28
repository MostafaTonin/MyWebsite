using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs;
using Portfolio.Api.Entities;
using AutoMapper;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProjectsController : ControllerBase
{
    private readonly PortfolioDbContext _context;
    private readonly IMapper _mapper;

    public ProjectsController(PortfolioDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    /// <summary>
    /// الحصول على جميع المشاريع مرتبة
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetAll()
    {
        var projects = await _context.Projects
            .Include(p => p.Images)
            .OrderBy(p => p.DisplayOrder)
            .ThenByDescending(p => p.CreatedDate)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<ProjectDto>>(projects));
    }

    /// <summary>
    /// الحصول على المشاريع المميزة
    /// </summary>
    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetFeatured()
    {
        var projects = await _context.Projects
            .Include(p => p.Images)
            .Where(p => p.IsFeatured)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<ProjectDto>>(projects));
    }

    /// <summary>
    /// الحصول على المشاريع المخصصة للصفحة الرئيسية
    /// </summary>
    [HttpGet("home")]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetForHome()
    {
        var projects = await _context.Projects
            .Include(p => p.Images)
            .Where(p => p.ShowOnHome)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<ProjectDto>>(projects));
    }

    /// <summary>
    /// الحصول على مشروع بالمعرف مع كامل التفاصيل
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectDto>> GetById(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
            return NotFound(new { message = "المشروع غير موجود" });

        return Ok(_mapper.Map<ProjectDto>(project));
    }

    /// <summary>
    /// إضافة مشروع جديد (Admin فقط)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProjectDto>> Create([FromBody] CreateProjectDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var project = _mapper.Map<Project>(dto);
        project.CreatedDate = DateTime.UtcNow;

        // إضافة الصور
        foreach (var imageUrl in dto.ImageUrls)
        {
            project.Images.Add(new ProjectImage { ImageUrl = imageUrl });
        }

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = project.Id }, _mapper.Map<ProjectDto>(project));
    }

    /// <summary>
    /// تحديث مشروع (Admin فقط)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateProjectDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var project = await _context.Projects
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
            return NotFound(new { message = "المشروع غير موجود" });

        _mapper.Map(dto, project);

        // تحديث الصور (بسيط: مسح القديم وإضافة الجديد، يمكن تطويره مستقبلاً)
        _context.ProjectImages.RemoveRange(project.Images);
        foreach (var imageUrl in dto.ImageUrls)
        {
            project.Images.Add(new ProjectImage { ImageUrl = imageUrl });
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "تم تحديث المشروع بنجاح" });
    }

    /// <summary>
    /// حذف مشروع (Admin فقط)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
            return NotFound(new { message = "المشروع غير موجود" });

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return Ok(new { message = "تم حذف المشروع بنجاح" });
    }
}
