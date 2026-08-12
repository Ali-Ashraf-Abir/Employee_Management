using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories;

public class LeaveRequestRepository
    : BaseRepository<LeaveRequest>,
      ILeaveRequestRepository
{
    public LeaveRequestRepository(
        ApplicationDbContext db)
        : base(db)
    {
    }

    public async Task<List<LeaveRequest>> GetByEmployeeIdAsync(
        Guid employeeId)
    {
        return await _collection
            .Include(x => x.LeaveType)
            .Where(x => x.EmployeeId == employeeId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
    public async Task<PagedData<LeaveRequest>> GetPagedAsync(string? search, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        IQueryable<LeaveRequest> query = _collection
            .AsNoTracking()
            .Include(x => x.Employee)
            .ThenInclude(x => x.User)
            .Include(x => x.LeaveType);

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();

            query = query.Where(x =>
                x.Employee.EmployeeId.Contains(search) ||
                x.Employee.FirstName.Contains(search) ||
                x.Employee.LastName.Contains(search) ||
                x.Employee.User.Email!.Contains(search));
        }

        return await PaginateAsync(query, page, pageSize, cancellationToken);
    }
    public async Task<LeaveRequest?> GetByIdAndEmployeeIdAsync(
        Guid id,
        Guid employeeId)
    {
        return await _collection
            .Include(x => x.LeaveType)
            .FirstOrDefaultAsync(
                x => x.Id == id &&
                     x.EmployeeId == employeeId);
    }

    public async Task<int> GetPendingDaysAsync(
        Guid employeeId,
        Guid leaveTypeId,
        int year,
        Guid? excludeRequestId = null)
    {
        var query = _collection
            .Where(x =>
                x.EmployeeId == employeeId &&
                x.LeaveTypeId == leaveTypeId &&
                x.Status == LeaveStatus.Pending &&
                x.StartDate.Year == year);

        if (excludeRequestId.HasValue)
        {
            query = query.Where(
                x => x.Id != excludeRequestId.Value);
        }

        return await query.SumAsync(x => x.Days);
    }
    public async Task<LeaveRequest?> GetLeaveByIdAsync(Guid id)
    {
        return await _collection
            .Include(x => x.LeaveType)
            .Include(x => x.Employee)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

}