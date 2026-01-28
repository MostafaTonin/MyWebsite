using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs;
using Portfolio.Api.Interfaces;
using System.Text;

namespace Portfolio.Api.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly PortfolioDbContext _context;

    public AnalyticsService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var stats = new DashboardStatsDto
        {
            TotalPosts = await _context.BlogPosts.CountAsync(),
            TotalViews = await _context.BlogPosts.SumAsync(p => p.ViewCount),
            TotalLikes = await _context.BlogPosts.SumAsync(p => p.LikeCount),
            TotalComments = await _context.BlogComments.CountAsync(),
            TotalUsers = await _context.Users.CountAsync()
        };

        // Top 5 Trending Posts
        stats.TrendingPosts = await _context.BlogPosts
            .OrderByDescending(p => p.ViewCount)
            .Take(5)
            .Select(p => new TrendingPostDto
            {
                Id = p.Id,
                Title = p.TitleEn,
                Views = p.ViewCount,
                Likes = p.LikeCount,
                EngagementRate = p.ViewCount > 0 ? (double)p.LikeCount / p.ViewCount * 100 : 0
            })
            .ToListAsync();

        // Last 6 Months Activity
        var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
        var monthlyPosts = await _context.BlogPosts
            .Where(p => p.PublishedDate >= sixMonthsAgo)
            .GroupBy(p => new { p.PublishedDate.Year, p.PublishedDate.Month })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                Count = g.Count(),
                Views = g.Sum(x => x.ViewCount)
            })
            .ToListAsync();

        stats.MonthlyActivity = monthlyPosts
            .OrderBy(m => m.Year)
            .ThenBy(m => m.Month)
            .Select(m => new MonthlyActivityDto
            {
                Month = new DateTime(m.Year, m.Month, 1).ToString("MMM"),
                PostCount = m.Count,
                ViewsCount = m.Views
            })
            .ToList();

        return stats;
    }

    public async Task<byte[]> ExportPostsCsvAsync()
    {
        var posts = await _context.BlogPosts
            .Include(p => p.Category)
            .OrderByDescending(p => p.PublishedDate)
            .ToListAsync();

        var csv = new StringBuilder();
        csv.AppendLine("Id,Title (EN),Category,Views,Likes,Comments,Published Date");

        foreach (var p in posts)
        {
            csv.AppendLine($"{p.Id},\"{p.TitleEn}\",{p.Category?.NameEn},{p.ViewCount},{p.LikeCount},0,{p.PublishedDate:yyyy-MM-dd}");
        }

        return Encoding.UTF8.GetBytes(csv.ToString());
    }
}
