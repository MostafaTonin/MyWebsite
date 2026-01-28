using System.Globalization;
using CsvHelper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Portfolio.Api.Data;

// Build configuration (reads Portfolio.Api appsettings.json if present)
var builder = new ConfigurationBuilder()
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("appsettings.json", optional: true)
    .AddEnvironmentVariables();

var config = builder.Build();
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                       ?? config.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    Console.WriteLine("ERROR: No connection string found. Set ConnectionStrings__DefaultConnection env var or provide appsettings.json with DefaultConnection.");
    return 1;
}

var optionsBuilder = new DbContextOptionsBuilder<PortfolioDbContext>();
optionsBuilder.UseSqlServer(connectionString);

using var db = new PortfolioDbContext(optionsBuilder.Options);

Console.WriteLine("Connected. Scanning BlogPosts for VideoUrl values...");

var posts = await db.BlogPosts.Where(p => p.VideoUrl != null && p.VideoUrl != "").ToListAsync();
if (posts.Count == 0)
{
    Console.WriteLine("No posts with videoUrl found.");
    return 0;
}

var backups = new List<(int Id, string OldUrl, string NewUrl)>();

string ToEmbed(string? url)
{
    if (string.IsNullOrWhiteSpace(url)) return string.Empty;
    var u = url.Trim();
    if (u.Contains("youtube.com/embed/")) return u;
    var vMatch = System.Text.RegularExpressions.Regex.Match(u, "[?&]v=([^&]+)");
    if (vMatch.Success) return $"https://www.youtube.com/embed/{vMatch.Groups[1].Value}";
    var shortMatch = System.Text.RegularExpressions.Regex.Match(u, "youtu\\.be/([^?&/]+)");
    if (shortMatch.Success) return $"https://www.youtube.com/embed/{shortMatch.Groups[1].Value}";
    var shortsMatch = System.Text.RegularExpressions.Regex.Match(u, "youtube\\.com/shorts/([^?&/]+)");
    if (shortsMatch.Success) return $"https://www.youtube.com/embed/{shortsMatch.Groups[1].Value}";
    return u;
}

foreach (var p in posts)
{
    var oldUrl = p.VideoUrl ?? string.Empty;
    var newUrl = ToEmbed(oldUrl);
    if (newUrl != oldUrl)
    {
        backups.Add((p.Id, oldUrl, newUrl));
        p.VideoUrl = newUrl;
    }
}

if (backups.Count == 0)
{
    Console.WriteLine("All video URLs already normalized.");
    return 0;
}

// Write backup CSV
var backupFile = Path.Combine(Directory.GetCurrentDirectory(), $"video-url-backup-{DateTime.UtcNow:yyyyMMddHHmmss}.csv");
using (var writer = new StreamWriter(backupFile))
using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
{
    csv.WriteRecords(backups.Select(b => new { b.Id, b.OldUrl, b.NewUrl }));
}

Console.WriteLine($"Backup written to {backupFile}");

Console.WriteLine($"Updating {backups.Count} posts...\n");
await db.SaveChangesAsync();

Console.WriteLine("Update completed.");
Console.WriteLine("If you need to revert, use the backup CSV to restore old URLs.");
return 0;
