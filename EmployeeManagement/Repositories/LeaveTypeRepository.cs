using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories;

public class LeaveTypeRepository
    : BaseRepository<LeaveType>,
      ILeaveTypeRepository
{
    public LeaveTypeRepository(ApplicationDbContext db)
        : base(db)
    {
    }

    public async Task<LeaveType?> GetByNameAsync(
        string name)
    {
        return await _collection
            .FirstOrDefaultAsync(
                x => x.Name == name);
    }

    public async Task<bool> ExistsByNameAsync(
        string name)
    {
        return await _collection
            .AnyAsync(x => x.Name == name);
    }
}