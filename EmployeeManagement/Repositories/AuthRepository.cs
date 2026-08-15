using EmployeeManagement.Data;
using EmployeeManagement.Models.Interfaces;
using EmployeeManagement.Models;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories;

public class AuthRepository : IAuthRepository
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AuthRepository(
        ApplicationDbContext db,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        _db = db;
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<ApplicationUser?> GetUserByEmailAsync(
        string email)
    {
        return await _userManager.FindByEmailAsync(email);
    }

    public async Task<bool> CheckPasswordAsync(
        ApplicationUser user,
        string password)
    {
        var result =
            await _signInManager.CheckPasswordSignInAsync(
                user,
                password,
                lockoutOnFailure: true);

        return result.Succeeded;
    }

    public async Task AddRefreshTokenAsync(
        RefreshToken refreshToken)
    {
        await _db.RefreshTokens.AddAsync(refreshToken);
    }

    public async Task<RefreshToken?> GetRefreshTokenAsync(
        string tokenHash)
    {
        return await _db.RefreshTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(
                x => x.TokenHash == tokenHash);
    }

    public Task RevokeRefreshTokenAsync(
        RefreshToken refreshToken)
    {
        refreshToken.RevokedAt = DateTime.UtcNow;

        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}