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
    public async Task<List<Employee>> GetAllEmployeeAsync()
    {
        return await _collection
            .Include(employee => employee.User)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Employee?> GetEmployeeByIdAsync(Guid id)
    {
        return await _collection
            .Include(employee => employee.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(employee => employee.Id == id);
    }
}