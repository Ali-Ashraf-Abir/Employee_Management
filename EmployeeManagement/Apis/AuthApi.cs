using EmployeeManagement.Contracts;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Apis;

[ApiController]
[Route("api/auth")]
public class AuthApi : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthApi(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginContract contract)
    {
        var result =
            await _authService.LoginAsync(contract);

        if (result == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        SetRefreshTokenCookie(
            result.RefreshToken);

        return Ok(new AuthResponse
        {
            AccessToken = result.AccessToken
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken =
            Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized(new
            {
                message = "Refresh token is missing."
            });
        }

        var result =
            await _authService.RefreshAsync(
                refreshToken);

        if (result == null)
        {
            DeleteRefreshTokenCookie();

            return Unauthorized(new
            {
                message =
                    "Invalid or expired refresh token."
            });
        }

        SetRefreshTokenCookie(
            result.RefreshToken);

        return Ok(new AuthResponse
        {
            AccessToken = result.AccessToken
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken =
            Request.Cookies["refreshToken"];

        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _authService.LogoutAsync(
                refreshToken);
        }

        DeleteRefreshTokenCookie();

        return NoContent();
    }

    private void SetRefreshTokenCookie(
        string refreshToken)
    {
        Response.Cookies.Append(
            "refreshToken",
            refreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires =
                    DateTimeOffset.UtcNow.AddDays(30),
                Path = "/api/auth"
            });
    }

    private void DeleteRefreshTokenCookie()
    {
        Response.Cookies.Delete(
            "refreshToken",
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/api/auth"
            });
    }
}