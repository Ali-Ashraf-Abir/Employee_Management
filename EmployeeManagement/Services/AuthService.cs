using EmployeeManagement.Contracts;
using EmployeeManagement.Models;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace EmployeeManagement.Services;
public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtService _jwtService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtService jwtService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse?> LoginAsync(
        LoginContract contract)
    {
        var user = await _userManager.FindByEmailAsync(
            contract.Email);

        if (user == null)
            return null;

        var result = await _signInManager.CheckPasswordSignInAsync(
            user,
            contract.Password,
            lockoutOnFailure: true);

        if (!result.Succeeded)
            return null;

        var token = await _jwtService.GenerateTokenAsync(user);

        return new AuthResponse
        {
            Token = token
        };
    }
}