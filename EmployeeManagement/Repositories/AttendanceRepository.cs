using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories;

public class AttendanceRepository : BaseRepository<AttendanceRecord>, IAttendanceRepository
{
    public AttendanceRepository(ApplicationDbContext db)
        : base(db)
    {
    }

    public async Task<AttendanceRecord?> GetOpenRecordAsync(Guid employeeId)
    {
        return await _collection
            .Include(x => x.Employee)
            .ThenInclude(x => x.User)
            .FirstOrDefaultAsync(x =>
                x.EmployeeId == employeeId &&
                x.LeftAt == null);
    }

    public async Task<PagedData<AttendanceRecord>> GetHistoryAsync(
        Guid? employeeId,
        AttendanceQuery query,
        CancellationToken cancellationToken = default)
    {
        IQueryable<AttendanceRecord> records = _collection
            .AsNoTracking()
            .Include(x => x.Employee)
            .ThenInclude(x => x.User);

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
            records = records.Where(x => x.EnteredAt >= query.From.Value.Date);

        if (query.To.HasValue)
        {
            var end = query.To.Value.Date.AddDays(1);
            records = records.Where(x => x.EnteredAt < end);
        }

        records = records.OrderByDescending(x => x.EnteredAt);

        return await PaginateAsync(
            records,
            query.Page,
            query.PageSize,
            cancellationToken);
    }

    public async Task<PagedData<AttendanceDailyResponse>> GetDailyReportAsync(
        AttendanceQuery query,
        CancellationToken cancellationToken = default)
    {
        IQueryable<AttendanceRecord> records = _collection
            .AsNoTracking()
            .Include(x => x.Employee)
            .ThenInclude(x => x.User);

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
            records = records.Where(x => x.EnteredAt >= query.From.Value.Date);

        if (query.To.HasValue)
        {
            var end = query.To.Value.Date.AddDays(1);
            records = records.Where(x => x.EnteredAt < end);
        }

        var grouped = records
            .GroupBy(x => new
            {
                x.EmployeeId,
                EmployeeCode = x.Employee.EmployeeId,
                x.Employee.FirstName,
                x.Employee.LastName,
                Date = x.EnteredAt.Date
            })
            .Select(x => new AttendanceDailyResponse
            {
                EmployeeId = x.Key.EmployeeId,
                EmployeeCode = x.Key.EmployeeCode,
                EmployeeName = x.Key.FirstName + " " + x.Key.LastName,
                Date = x.Key.Date,
                FirstEntry = x.Min(r => r.EnteredAt),
                LastExit = x.Max(r => r.LeftAt),
                TotalMinutes = x.Sum(r =>
                    r.LeftAt.HasValue
                        ? (int)(r.LeftAt.Value - r.EnteredAt).TotalMinutes
                        : 0),
                IsCurrentlyInside = x.Any(r => r.LeftAt == null)
            });

        var totalCount = await grouped.CountAsync(cancellationToken);

        var items = await grouped
            .OrderByDescending(x => x.Date)
            .ThenBy(x => x.EmployeeCode)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedData<AttendanceDailyResponse>
        {
            Items = items,
            TotalCount = totalCount
        };
    }
}