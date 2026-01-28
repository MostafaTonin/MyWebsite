using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.DTOs;
using Portfolio.Api.Entities;
using Portfolio.Api.Interfaces;
using AutoMapper;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SkillsController : ControllerBase
{
    private readonly IRepository<Skill> _repository;
    private readonly IMapper _mapper;

    public SkillsController(IRepository<Skill> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    /// <summary>
    /// الحصول على جميع المهارات
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SkillDto>>> GetAll()
    {
        var skills = (await _repository.GetAllAsync())
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .ThenByDescending(s => s.Proficiency);
            
        var skillDtos = _mapper.Map<IEnumerable<SkillDto>>(skills);

        return Ok(skillDtos);
    }

    /// <summary>
    /// الحصول على المهارات حسب التصنيف
    /// </summary>
    [HttpGet("by-category/{category}")]
    public async Task<ActionResult<IEnumerable<SkillDto>>> GetByCategory(string category)
    {
        var skills = (await _repository.GetAllAsync())
            .Where(s => s.IsActive && s.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
            .OrderBy(s => s.DisplayOrder)
            .ThenByDescending(s => s.Proficiency);
            
        var skillDtos = _mapper.Map<IEnumerable<SkillDto>>(skills);

        return Ok(skillDtos);
    }

    /// <summary>
    /// الحصول على مهارة بالمعرف
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SkillDto>> GetById(int id)
    {
        var skill = await _repository.GetByIdAsync(id);
        if (skill == null)
            return NotFound(new { message = "المهارة غير موجودة" });

        var skillDto = _mapper.Map<SkillDto>(skill);

        return Ok(skillDto);
    }

    /// <summary>
    /// الحصول على جميع المهارات للأدمن (بما في ذلك غير المفعلة)
    /// </summary>
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<SkillDto>>> GetAllAdmin()
    {
        var skills = (await _repository.GetAllAsync())
            .OrderBy(s => s.Category)
            .ThenBy(s => s.DisplayOrder);
            
        var skillDtos = _mapper.Map<IEnumerable<SkillDto>>(skills);

        return Ok(skillDtos);
    }

    /// <summary>
    /// إضافة مهارة جديدة (Admin فقط)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SkillDto>> Create([FromBody] CreateSkillDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var skill = _mapper.Map<Skill>(dto);

        await _repository.AddAsync(skill);

        var skillDto = _mapper.Map<SkillDto>(skill);

        return CreatedAtAction(nameof(GetById), new { id = skill.Id }, skillDto);
    }

    /// <summary>
    /// تحديث مهارة (Admin فقط)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateSkillDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var skill = await _repository.GetByIdAsync(id);
        if (skill == null)
            return NotFound(new { message = "المهارة غير موجودة" });

        _mapper.Map(dto, skill);

        await _repository.UpdateAsync(skill);

        return Ok(new { message = "تم تحديث المهارة بنجاح" });
    }

    /// <summary>
    /// حذف مهارة (Admin فقط)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!await _repository.ExistsAsync(id))
            return NotFound(new { message = "المهارة غير موجودة" });

        await _repository.DeleteAsync(id);
        return Ok(new { message = "تم حذف المهارة بنجاح" });
    }
}
