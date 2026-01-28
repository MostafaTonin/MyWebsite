using Portfolio.Api.DTOs;

namespace Portfolio.Api.Interfaces;

/// <summary>
/// واجهة خدمة المصادقة
/// </summary>
public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto?> RefreshTokenAsync(string token);
    Task<bool> RevokeTokenAsync(string token);
    string GenerateJwtToken(string username, string role);

    // User Management
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<bool> RegisterAsync(RegisterDto registerDto);
    Task<bool> UpdateUserAsync(int id, UpdateUserDto updateDto);
    Task<bool> DeleteUserAsync(int id);
}
