using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Interfaces;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var stats = await _analyticsService.GetDashboardStatsAsync();
        return Ok(stats);
    }

    [HttpGet("export/posts")]
    public async Task<IActionResult> ExportPosts()
    {
        var csvBytes = await _analyticsService.ExportPostsCsvAsync();
        return File(csvBytes, "text/csv", $"blog-posts-report-{DateTime.Now:yyyyMMdd}.csv");
    }
}
