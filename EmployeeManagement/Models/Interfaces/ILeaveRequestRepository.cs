using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Core.Repositories.Interfaces;
using EmployeeManagement.Models;

namespace EmployeeManagement.Models.Interfaces;

public interface ILeaveRequestRepository: IBaseRepository<LeaveRequest>
{
    Task<List<LeaveRequest>> GetByEmployeeIdAsync(Guid employeeId);
    Task<LeaveRequest?> GetByIdAndEmployeeIdAsync(Guid id,Guid employeeId);
    Task<int> GetPendingDaysAsync(Guid employeeId,Guid leaveTypeId,int year,Guid? excludeRequestId = null);
    Task<PagedData<LeaveRequest>> GetPagedAsync(string? search, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<PagedData<LeaveRequest>> GetPagedByEmployeeIdAsync(Guid employeeId, string? search, int page, int pageSize, CancellationToken cancellationToken = default);
}