using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories;

public class EmployeeLeaveBalanceRepository
    : BaseRepository<EmployeeLeaveBalance>,
      IEmployeeLeaveBalanceRepository
{
    public EmployeeLeaveBalanceRepository(
        ApplicationDbContext db)
        : base(db)
    {
    }

    public async Task<EmployeeLeaveBalance?> GetAsync(
        Guid employeeId,
        Guid leaveTypeId,
        int year)
    {
        return await _collection.FirstOrDefaultAsync(
            x =>
                x.EmployeeId == employeeId &&
                x.LeaveTypeId == leaveTypeId &&
                x.Year == year);
    }
}