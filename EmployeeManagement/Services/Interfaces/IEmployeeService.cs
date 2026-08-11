using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Contracts;

namespace EmployeeManagement.Services.Interfaces;

public interface IEmployeeService
{
    Task<PagedResult<EmployeeContract>> GetAllAsync(PaginationQuery query);
    Task<EmployeeContract?> GetByIdAsync(Guid id);
    Task<EmployeeContract> CreateAsync(EmployeeContract contract);
    Task<EmployeeContract?> UpdateAsync(Guid id,EmployeeUpdateContract contract);
    Task<bool> UpdateRolesAsync(Guid employeeId, List<string> roles);
    Task<bool> DisableAsync(Guid id);
    Task<bool> EnableAsync(Guid id);
}