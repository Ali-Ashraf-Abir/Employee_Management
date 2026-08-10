using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Contracts;
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
        var response = await _authService.LoginAsync(contract);

        if (response == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        return Ok(response);
    }
}