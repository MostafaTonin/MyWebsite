using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.DTOs;
using Portfolio.Api.Interfaces;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// تسجيل الدخول
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var authResponse = await _authService.LoginAsync(loginDto);

        if (authResponse == null)
            return Unauthorized(new { message = "اسم المستخدم أو كلمة المرور غير صحيحة" });

        // Set Refresh Token in HttpOnly Cookie for extra security
        SetRefreshTokenCookie(authResponse.RefreshToken);

        return Ok(authResponse);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest? request)
    {
        // Try to get token from body or from cookies
        var refreshToken = request?.RefreshToken ?? Request.Cookies["refreshToken"];
        
        if (string.IsNullOrEmpty(refreshToken))
            return BadRequest(new { message = "Refresh token is required" });

        var response = await _authService.RefreshTokenAsync(refreshToken);

        if (response == null)
            return Unauthorized(new { message = "الجلسة انتهت، اعد تسجيل الدخول" });

        SetRefreshTokenCookie(response.RefreshToken);

        return Ok(response);
    }

    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequest request)
    {
        var token = request.Token ?? Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(token))
            return BadRequest(new { message = "Token is required" });

        var result = await _authService.RevokeTokenAsync(token);

        if (!result)
            return NotFound(new { message = "Token not found" });

        return Ok(new { message = "Token revoked" });
    }

    // User Management (Admin Only)

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _authService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPost("register")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.RegisterAsync(registerDto);

        if (!result)
            return BadRequest(new { message = "اسم المستخدم أو البريد الإلكتروني موجود مسبقاً" });

        return Ok(new { message = "تم إنشاء الحساب بنجاح" });
    }

    [HttpPost("register-public")]
    public async Task<IActionResult> RegisterPublic([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Force role to User for public registration
        registerDto.Role = "User";

        var result = await _authService.RegisterAsync(registerDto);

        if (!result)
            return BadRequest(new { message = "اسم المستخدم أو البريد الإلكتروني موجود مسبقاً" });

        return Ok(new { message = "تم إنشاء الحساب بنجاح" });
    }

    [HttpPut("users/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateDto)
    {
        var result = await _authService.UpdateUserAsync(id, updateDto);

        if (!result)
            return BadRequest(new { message = "فشل تحديث البيانات أو اسم المستخدم غير متاح" });

        return Ok(new { message = "تم تحديث البيانات بنجاح" });
    }

    [HttpDelete("users/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var result = await _authService.DeleteUserAsync(id);

        if (!result)
            return NotFound(new { message = "الحساب غير موجود" });

        return Ok(new { message = "تم حذف الحساب بنجاح" });
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
            SameSite = SameSiteMode.Strict,
            Secure = true // Always true in production
        };
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }
}

public class RevokeTokenRequest
{
    public string? Token { get; set; }
}

public class RefreshTokenRequest
{
    public string? Token { get; set; } // Compatibility with some frontends
    public string? RefreshToken { get; set; }
}
