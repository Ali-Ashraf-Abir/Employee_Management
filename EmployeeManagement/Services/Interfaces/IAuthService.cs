using EmployeeManagement.Contracts;

namespace EmployeeManagement.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(
        LoginContract contract);

    Task<AuthResponse?> RefreshAsync(
        string refreshToken);

    Task<bool> LogoutAsync(
        string refreshToken);
}