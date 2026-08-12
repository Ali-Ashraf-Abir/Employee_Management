using EmployeeManagement.Contracts;

namespace EmployeeManagement.Services.Interfaces;

public interface ILeaveBalanceService
{
    Task<List<LeaveBalanceResponse>> GetMyBalancesAsync(Guid userId, int year);
    Task<int> GetAvailableDaysAsync(Guid employeeId, Guid leaveTypeId, int year, Guid? excludeRequestId = null);
}