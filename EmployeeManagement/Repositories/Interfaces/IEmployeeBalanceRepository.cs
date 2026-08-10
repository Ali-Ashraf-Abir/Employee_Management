using EmployeeManagement.Core.Repositories.Interfaces;
using EmployeeManagement.Models;

namespace EmployeeManagement.Repositories.Interfaces;

public interface IEmployeeLeaveBalanceRepository
    : IBaseRepository<EmployeeLeaveBalance>
{
    Task<EmployeeLeaveBalance?> GetAsync(
        Guid employeeId,
        Guid leaveTypeId,
        int year);
}