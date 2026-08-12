using EmployeeManagement.Core.Repositories.Interfaces;
using EmployeeManagement.Models;

namespace EmployeeManagement.Models.Interfaces;

public interface ILeaveTypeRepository
    : IBaseRepository<LeaveType>
{
    Task<LeaveType?> GetByNameAsync(string name);

    Task<bool> ExistsByNameAsync(string name);
    Task<List<LeaveType>> GetActiveAsync();
}