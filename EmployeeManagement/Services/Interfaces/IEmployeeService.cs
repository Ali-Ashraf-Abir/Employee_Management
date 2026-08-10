using EmployeeManagement.Contracts;

namespace EmployeeManagement.Services.Interfaces;

public interface IEmployeeService
{
    Task<EmployeeContract> CreateAsync(
        EmployeeContract contract);

    Task<EmployeeContract?> UpdateAsync(
        Guid id,
        EmployeeUpdateContract contract);

    Task<bool> DisableAsync(Guid id);
}