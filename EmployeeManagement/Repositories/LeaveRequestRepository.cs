using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Repositories.Interfaces;
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