using EmployeeManagement.Contracts;

public interface ILeaveRequestService
{
    Task<LeaveRequestResponse> CreateAsync(
        Guid userId,
        LeaveRequestContract contract);

    Task<LeaveRequestResponse?> GetByIdAsync(
        Guid userId,
        Guid id);

    Task<IEnumerable<LeaveRequestResponse>> GetMineAsync(
        Guid userId);

    Task<LeaveRequestResponse?> UpdateAsync(
        Guid userId,
        Guid id,
        LeaveRequestContract contract);

    Task<bool> DeleteAsync(
        Guid userId,
        Guid id);

    Task<bool> ApproveAsync(
        Guid adminId,
        Guid leaveRequestId);

    Task<bool> RejectAsync(
        Guid adminId,
        Guid leaveRequestId);
}