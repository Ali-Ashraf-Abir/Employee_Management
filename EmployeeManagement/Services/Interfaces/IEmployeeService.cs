using EmployeeManagement.Contracts;

namespace EmployeeManagement.Services.Interfaces;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeContract>> GetAllAsync();
    Task<EmployeeContract?> GetByIdAsync(Guid id);
    Task<EmployeeContract> CreateAsync(
        EmployeeContract contract);

    Task<EmployeeContract?> UpdateAsync(
        Guid id,
        EmployeeUpdateContract contract);

    Task<bool> DisableAsync(Guid id);
    Task<bool> EnableAsync(Guid id);
}