using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Core.Repositories.Interfaces;
using EmployeeManagement.Models;

public interface IAttendanceRepository : IBaseRepository<AttendanceRecord>
{
    Task<AttendanceRecord?> GetOpenRecordAsync(Guid employeeId);
    Task<PagedData<AttendanceResponse>> GetHistoryAsync(Guid? employeeId, AttendanceQuery query, CancellationToken cancellationToken = default);
    Task<PagedData<AttendanceDailyData>> GetDailyReportAsync(AttendanceQuery query, CancellationToken cancellationToken = default);
}