using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using Microsoft.EntityFrameworkCore;


namespace EmployeeManagement.Repositories;

public class AttendanceRepository : BaseRepository<AttendanceRecord>, IAttendanceRepository
{
    public AttendanceRepository(ApplicationDbContext db) : base(db)
    {
    }

    public async Task<AttendanceRecord?> GetOpenRecordAsync(Guid employeeId)
    {
        return await _collection.FirstOrDefaultAsync(x =>
            x.EmployeeId == employeeId &&
            x.LeftAt == null);
    }

    public async Task<PagedData<AttendanceResponse>> GetHistoryAsync(Guid? employeeId, AttendanceQuery query, CancellationToken cancellationToken = default)
    {
        IQueryable<AttendanceRecord> records = _collection.AsNoTracking();

        if (employeeId.HasValue)
            records = records.Where(x => x.EmployeeId == employeeId.Value);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();

            records = records.Where(x =>
                x.Employee.EmployeeId.Contains(search) ||
                x.Employee.FirstName.Contains(search) ||
                x.Employee.LastName.Contains(search) ||
                x.Employee.User.Email!.Contains(search));
        }

        if (query.From.HasValue)
        {
            var fromUtc = ConvertDhakaDateToUtc(query.From.Value.Date);
            records = records.Where(x => x.EnteredAt >= fromUtc);
        }

        if (query.To.HasValue)
        {
            var toUtc = ConvertDhakaDateToUtc(query.To.Value.Date.AddDays(1));
            records = records.Where(x => x.EnteredAt < toUtc);
        }

        var projected = records
            .OrderByDescending(x => x.EnteredAt)
            .ThenByDescending(x => x.Id)
            .Select(x => new AttendanceResponse
            {
                Id = x.Id,
                EmployeeId = x.EmployeeId,
                EmployeeCode = x.Employee.EmployeeId,
                EmployeeName = x.Employee.FirstName + " " + x.Employee.LastName,
                EnteredAt = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(x.EnteredAt, "Asia/Dhaka"),
                LeftAt = x.LeftAt.HasValue
                    ? TimeZoneInfo.ConvertTimeBySystemTimeZoneId(x.LeftAt.Value, "Asia/Dhaka")
                    : null
            });

        return await PaginateAsync(projected, query.Page, query.PageSize, cancellationToken);
    }
    public async Task<PagedData<AttendanceDailyData>> GetDailyReportAsync(AttendanceQuery query, CancellationToken cancellationToken = default)
    {
        IQueryable<AttendanceRecord> records = _collection.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();

            records = records.Where(x =>
                x.Employee.EmployeeId.Contains(search) ||
                x.Employee.FirstName.Contains(search) ||
                x.Employee.LastName.Contains(search) ||
                x.Employee.User.Email!.Contains(search));
        }

        if (query.From.HasValue)
        {
            var fromUtc = ConvertDhakaDateToUtc(query.From.Value.Date);
            records = records.Where(x => x.EnteredAt >= fromUtc);
        }

        if (query.To.HasValue)
        {
            var toUtc = ConvertDhakaDateToUtc(query.To.Value.Date.AddDays(1));
            records = records.Where(x => x.EnteredAt < toUtc);
        }

        var grouped = records
            .GroupBy(x => new
            {
                x.EmployeeId,
                EmployeeCode = x.Employee.EmployeeId,
                x.Employee.FirstName,
                x.Employee.LastName,
                Date = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(x.EnteredAt, "Asia/Dhaka").Date
            })
            .Select(x => new AttendanceDailyData
            {
                EmployeeId = x.Key.EmployeeId,
                EmployeeCode = x.Key.EmployeeCode,
                EmployeeName = x.Key.FirstName + " " + x.Key.LastName,
                Date = x.Key.Date,
                FirstEntry = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(
                    x.Min(r => r.EnteredAt),
                    "Asia/Dhaka"),
                LastExit = x.Max(r => r.LeftAt) != null
                    ? TimeZoneInfo.ConvertTimeBySystemTimeZoneId(
                        x.Max(r => r.LeftAt)!.Value,
                        "Asia/Dhaka")
                    : null,
                TotalMinutes = x
                    .Where(r => r.LeftAt.HasValue)
                    .Sum(r => (int)(r.LeftAt!.Value - r.EnteredAt).TotalMinutes),
                IsCurrentlyInside = x.Any(r => r.LeftAt == null)
            });

        var totalCount = await grouped.CountAsync(cancellationToken);

        var items = await grouped
            .OrderByDescending(x => x.Date)
            .ThenBy(x => x.EmployeeCode)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedData<AttendanceDailyData>
        {
            Items = items,
            TotalCount = totalCount
        };
    }
    private static DateTime ConvertDhakaDateToUtc(DateTime date)
    {
        var dhaka = TimeZoneInfo.FindSystemTimeZoneById("Asia/Dhaka");
        var unspecified = DateTime.SpecifyKind(date, DateTimeKind.Unspecified);
        return TimeZoneInfo.ConvertTimeToUtc(unspecified, dhaka);
    }
}