
namespace Portfolio.Api.DTOs;

public class AuthResponseDto
{
    public int Id { get; set; }
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string[] Roles { get; set; } = Array.Empty<string>();
    public string Message { get; set; } = string.Empty;
}
