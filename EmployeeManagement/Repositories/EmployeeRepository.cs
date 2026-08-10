using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories;

public class EmployeeRepository
    : BaseRepository<Employee>,
      IEmployeeRepository
{
    public EmployeeRepository(ApplicationDbContext db)
        : base(db)
    {
    }

    public async Task<Employee?> GetByUserIdAsync(Guid userId)
    {
        return await _collection
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.UserId == userId);
    }
}