using EmployeeManagement.Core.Repositories.Interfaces;
using EmployeeManagement.Models;

namespace EmployeeManagement.Repositories.Interfaces;

public interface ILeaveTypeRepository
    : IBaseRepository<LeaveType>
{
    Task<LeaveType?> GetByNameAsync(string name);

    Task<bool> ExistsByNameAsync(string name);
}