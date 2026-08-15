using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Core.Repositories.Interfaces;
using EmployeeManagement.Models;
namespace EmployeeManagement.Models.Interfaces;
public interface IEmployeeRepository
    : IBaseRepository<Employee>
{
    Task<Employee?> GetByUserIdAsync(Guid userId);
    Task<Employee?> GetEmployeeByIdAsync(Guid id);
    Task<ApplicationUser?> GetUserByEmployeeIdAsync(Guid employeeId);
    Task<PagedData<Employee>> GetPagedAsync(string? search, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<Dictionary<Guid, List<string>>> GetRolesByUserIdsAsync(List<Guid> userIds);
    Task<(Employee Employee, List<string> Roles)?> GetEmployeeWithRolesByIdAsync(Guid id);
    Task<List<ApplicationUser>> GetUsersByRolesAsync(List<string> roles);
}