using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Core.Repositories.Interfaces;
using EmployeeManagement.Models;

public interface IAttendanceRepository : IBaseRepository<AttendanceRecord>
{
    Task<AttendanceRecord?> GetOpenRecordAsync(Guid employeeId);
    Task<PagedData<AttendanceRecord>> GetHistoryAsync(Guid? employeeId, AttendanceQuery query, CancellationToken cancellationToken = default);
    Task<PagedData<AttendanceDailyResponse>> GetDailyReportAsync(AttendanceQuery query, CancellationToken cancellationToken = default);

}