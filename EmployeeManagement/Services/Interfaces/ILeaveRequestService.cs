using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Contracts;

public interface ILeaveRequestService
{
    Task<LeaveRequestResponse> CreateAsync(Guid userId,LeaveRequestContract contract);
    Task<LeaveRequestResponse?> GetByIdAsync(Guid userId,Guid id);
    Task<PagedResult<LeaveRequestResponse>> GetMineAsync(Guid userId, PaginationQuery query);
    Task<LeaveRequestResponse?> UpdateAsync(Guid userId,Guid id,LeaveRequestContract contract);
    Task<bool> DeleteAsync(Guid userId,Guid id);
    Task<bool> ApproveAsync(Guid adminId,Guid leaveRequestId);
    Task<PagedResult<LeaveRequestResponse>> GetAllAsync(PaginationQuery query);
    Task<bool> RejectAsync(Guid adminId,Guid leaveRequestId);
}