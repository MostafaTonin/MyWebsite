
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Entities;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SiteSectionsController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public SiteSectionsController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SiteSection>>> GetAll()
    {
        return await _context.SiteSections
            .OrderBy(s => s.NavbarOrder)
            .ToListAsync();
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAll([FromBody] List<SiteSection> sections)
    {
        if (sections == null || !sections.Any())
            return BadRequest("No data provided");

        foreach (var section in sections)
        {
            var existing = await _context.SiteSections.FindAsync(section.Id);
            if (existing != null)
            {
                existing.TitleAr = section.TitleAr;
                existing.TitleEn = section.TitleEn;
                existing.IconName = section.IconName;
                existing.IsVisibleInNavbar = section.IsVisibleInNavbar;
                existing.NavbarOrder = section.NavbarOrder;
                existing.IsVisibleInHome = section.IsVisibleInHome;
                existing.HomeOrder = section.HomeOrder;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(await _context.SiteSections.OrderBy(s => s.NavbarOrder).ToListAsync());
    }
}
