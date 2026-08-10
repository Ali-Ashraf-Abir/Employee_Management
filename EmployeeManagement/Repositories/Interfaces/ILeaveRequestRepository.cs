using EmployeeManagement.Core.Repositories.Interfaces;
using EmployeeManagement.Models;

namespace EmployeeManagement.Repositories.Interfaces;

public interface ILeaveRequestRepository
    : IBaseRepository<LeaveRequest>
{
    Task<List<LeaveRequest>> GetByEmployeeIdAsync(
        Guid employeeId);

    Task<LeaveRequest?> GetByIdAndEmployeeIdAsync(
        Guid id,
        Guid employeeId);

    Task<int> GetPendingDaysAsync(
        Guid employeeId,
        Guid leaveTypeId,
        int year,
        Guid? excludeRequestId = null);
}