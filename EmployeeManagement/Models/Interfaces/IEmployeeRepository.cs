using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Core.Repositories.Interfaces;
using EmployeeManagement.Models;
namespace EmployeeManagement.Models.Interfaces;
public interface IEmployeeRepository
    : IBaseRepository<Employee>
{
    Task<Employee?> GetByUserIdAsync(Guid userId);
    Task<Employee?> GetEmployeeByIdAsync(Guid id);
    Task<PagedData<Employee>> GetPagedAsync(string? search, int page, int pageSize, CancellationToken cancellationToken = default);
}