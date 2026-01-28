
namespace Portfolio.Api.DTOs;

public class DashboardStatsDto
{
    public int TotalPosts { get; set; }
    public int TotalViews { get; set; }
    public int TotalLikes { get; set; }
    public int TotalComments { get; set; }
    public int TotalUsers { get; set; }
    public List<TrendingPostDto> TrendingPosts { get; set; } = new();
    public List<MonthlyActivityDto> MonthlyActivity { get; set; } = new();
}

public class TrendingPostDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Views { get; set; }
    public int Likes { get; set; }
    public double EngagementRate { get; set; }
}

public class MonthlyActivityDto
{
    public string Month { get; set; } = string.Empty;
    public int PostCount { get; set; }
    public int ViewsCount { get; set; }
}
