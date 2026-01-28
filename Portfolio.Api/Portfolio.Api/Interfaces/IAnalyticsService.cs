using Portfolio.Api.DTOs;

namespace Portfolio.Api.Interfaces;

public interface IAnalyticsService
{
    Task<DashboardStatsDto> GetDashboardStatsAsync();
    Task<byte[]> ExportPostsCsvAsync();
}
