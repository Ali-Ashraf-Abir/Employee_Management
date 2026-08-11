using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Contracts;

public interface IAttendanceService
{
    Task<AttendanceResponse> EnterAsync(Guid userId);
    Task<AttendanceResponse> LeaveAsync(Guid userId);
    Task<PagedResult<AttendanceResponse>> GetMineAsync(Guid userId, AttendanceQuery query);
    Task<PagedResult<AttendanceResponse>> GetHistoryAsync(AttendanceQuery query);
    Task<PagedResult<AttendanceDailyResponse>> GetDailyReportAsync(AttendanceQuery query);
}