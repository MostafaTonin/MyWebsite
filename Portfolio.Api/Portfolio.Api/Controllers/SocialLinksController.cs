using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.DTOs;
using Portfolio.Api.Entities;
using Portfolio.Api.Interfaces;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SocialLinksController : ControllerBase
{
    private readonly IRepository<SocialLink> _repository;

    public SocialLinksController(IRepository<SocialLink> repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SocialLinkDto>>> GetAll()
    {
        var links = await _repository.GetAllAsync();
        var dtos = links
            .Where(l => l.IsActive)
            .OrderBy(l => l.DisplayOrder)
            .Select(l => new SocialLinkDto
            {
                Id = l.Id,
                Platform = l.Platform,
                Url = l.Url,
                IconName = l.IconName,
                DisplayOrder = l.DisplayOrder,
                IsActive = l.IsActive
            });

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SocialLinkDto>> GetById(int id)
    {
        var link = await _repository.GetByIdAsync(id);
        if (link == null) return NotFound();
        
        return Ok(new SocialLinkDto
        {
            Id = link.Id,
            Platform = link.Platform,
            Url = link.Url,
            IconName = link.IconName,
            DisplayOrder = link.DisplayOrder,
            IsActive = link.IsActive
        });
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SocialLinkDto>> Create([FromBody] CreateSocialLinkDto dto)
    {
        var link = new SocialLink
        {
            Platform = dto.Platform,
            Url = dto.Url,
            IconName = dto.IconName,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };

        await _repository.AddAsync(link);

        return CreatedAtAction(nameof(GetById), new { id = link.Id }, new SocialLinkDto
        {
            Id = link.Id,
            Platform = link.Platform,
            Url = link.Url,
            IconName = link.IconName,
            DisplayOrder = link.DisplayOrder,
            IsActive = link.IsActive
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateSocialLinkDto dto)
    {
        var link = await _repository.GetByIdAsync(id);
        if (link == null) return NotFound();

        link.Platform = dto.Platform;
        link.Url = dto.Url;
        link.IconName = dto.IconName;
        link.DisplayOrder = dto.DisplayOrder;
        link.IsActive = dto.IsActive;

        await _repository.UpdateAsync(link);
        return Ok(new { message = "تم تحديث الرابط بنجاح" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return Ok(new { message = "تم حذف الرابط بنجاح" });
    }
}
