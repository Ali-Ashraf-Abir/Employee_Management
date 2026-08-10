using EmployeeManagement.Contracts;

namespace EmployeeManagement.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(LoginContract contract);
}