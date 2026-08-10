
using EmployeeManagement.Models;

namespace EmployeeManagement.Services.Interfaces;

public interface IJwtService
{
    Task<string> GenerateTokenAsync(ApplicationUser user);
}