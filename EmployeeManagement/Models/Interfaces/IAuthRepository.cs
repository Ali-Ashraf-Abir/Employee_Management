using EmployeeManagement.Models;

namespace EmployeeManagement.Models.Interfaces;

public interface IAuthRepository
{
    Task<ApplicationUser?> GetUserByEmailAsync(string email);
    Task<bool> CheckPasswordAsync(
        ApplicationUser user,
        string password);

    Task AddRefreshTokenAsync(
        RefreshToken refreshToken);

    Task<RefreshToken?> GetRefreshTokenAsync(
        string tokenHash);

    Task RevokeRefreshTokenAsync(
        RefreshToken refreshToken);

    Task SaveChangesAsync();
}