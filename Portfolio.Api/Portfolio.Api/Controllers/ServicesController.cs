using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Portfolio.Api.DTOs;
using Portfolio.Api.Entities;
using Portfolio.Api.Interfaces;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ServicesController : ControllerBase
{
    private readonly IRepository<Service> _repository;
    private readonly IMapper _mapper;

    public ServicesController(IRepository<Service> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    /// <summary>
    /// الحصول على جميع الخدمات المفعلة
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAll()
    {
        var services = (await _repository.GetAllAsync())
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder);
            
        return Ok(_mapper.Map<IEnumerable<ServiceDto>>(services));
    }

    /// <summary>
    /// الحصول على الخدمات المخصصة للصفحة الرئيسية
    /// </summary>
    [HttpGet("home")]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetForHome()
    {
        var services = (await _repository.GetAllAsync())
            .Where(s => s.IsActive && s.ShowOnHome)
            .OrderBy(s => s.DisplayOrder);
            
        return Ok(_mapper.Map<IEnumerable<ServiceDto>>(services));
    }

    /// <summary>
    /// الحصول على جميع الخدمات للأدمن
    /// </summary>
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAllAdmin()
    {
        var services = (await _repository.GetAllAsync())
            .OrderBy(s => s.DisplayOrder);
            
        return Ok(_mapper.Map<IEnumerable<ServiceDto>>(services));
    }

    /// <summary>
    /// الحصول على خدمة بالمعرف
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceDto>> GetById(int id)
    {
        var service = await _repository.GetByIdAsync(id);
        if (service == null)
            return NotFound(new { message = "الخدمة غير موجودة" });

        return Ok(_mapper.Map<ServiceDto>(service));
    }

    /// <summary>
    /// إضافة خدمة جديدة (Admin فقط)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ServiceDto>> Create([FromBody] CreateServiceDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var service = _mapper.Map<Service>(dto);
        await _repository.AddAsync(service);

        var serviceDto = _mapper.Map<ServiceDto>(service);
        return CreatedAtAction(nameof(GetById), new { id = service.Id }, serviceDto);
    }

    /// <summary>
    /// تحديث خدمة (Admin فقط)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateServiceDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var service = await _repository.GetByIdAsync(id);
        if (service == null)
            return NotFound(new { message = "الخدمة غير موجودة" });

        _mapper.Map(dto, service);
        await _repository.UpdateAsync(service);

        return Ok(new { message = "تم تحديث الخدمة بنجاح" });
    }

    /// <summary>
    /// حذف خدمة (Admin فقط)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!await _repository.ExistsAsync(id))
            return NotFound(new { message = "الخدمة غير موجودة" });

        await _repository.DeleteAsync(id);
        return Ok(new { message = "تم حذف الخدمة بنجاح" });
    }
}
