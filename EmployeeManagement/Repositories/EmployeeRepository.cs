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

    public async Task<Employee?> GetEmployeeByIdAsync(Guid id)
    {
        return await _collection
            .Include(employee => employee.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(employee => employee.Id == id);
    }
    public async Task<PagedData<Employee>> GetPagedAsync(string? search, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        IQueryable<Employee> query = _collection
            .AsNoTracking()
            .Include(x => x.User);

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();

            query = query.Where(x =>
                x.EmployeeId.Contains(search) ||
                x.FirstName.Contains(search) ||
                x.LastName.Contains(search) ||
                x.Department.Contains(search) ||
                x.Position.Contains(search) ||
                x.User.Email!.Contains(search));
        }

        query = query.OrderBy(x => x.EmployeeId);

        return await PaginateAsync(query, page, pageSize, cancellationToken);
    }
}