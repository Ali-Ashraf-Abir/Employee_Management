using EmployeeManagement.Core.Repositories.Interfaces;
using EmployeeManagement.Models;
namespace EmployeeManagement.Repositories.Interfaces;
public interface IEmployeeRepository
    : IBaseRepository<Employee>
{
    Task<Employee?> GetByUserIdAsync(Guid userId);
}