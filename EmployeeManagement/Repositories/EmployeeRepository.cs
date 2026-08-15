using EmployeeManagement.Core.Repositories;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Models.Interfaces;
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
    public async Task<ApplicationUser?> GetUserByEmployeeIdAsync(Guid employeeId)
    {
        return await _collection
            .Where(x => x.Id == employeeId)
            .Select(x => x.User)
            .FirstOrDefaultAsync();
    }
    public async Task<List<ApplicationUser>> GetUsersByRolesAsync(List<string> roles)
    {
        return await (
            from user in _db.Users
            join userRole in _db.UserRoles
                on user.Id equals userRole.UserId
            join role in _db.Roles
                on userRole.RoleId equals role.Id
            where roles.Contains(role.Name!)
            select user
        )
        .Distinct()
        .ToListAsync();
    }
    public async Task<Employee?> GetEmployeeByIdAsync(Guid id)
    {
        return await _collection
            .Include(employee => employee.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(employee => employee.Id == id);
    }
    public async Task<Dictionary<Guid, List<string>>> GetRolesByUserIdsAsync(List<Guid> userIds)
    {
        var data = await (
            from userRole in _db.UserRoles
            join role in _db.Roles on userRole.RoleId equals role.Id
            where userIds.Contains(userRole.UserId)
            select new
            {
                userRole.UserId,
                RoleName = role.Name!
            })
            .ToListAsync();

        return data
            .GroupBy(x => x.UserId)
            .ToDictionary(
                x => x.Key,
                x => x.Select(y => y.RoleName).ToList());
    }
    public async Task<(Employee Employee, List<string> Roles)?> GetEmployeeWithRolesByIdAsync(Guid id)
    {
        var employee = await _collection
            .Include(x => x.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (employee == null)
            return null;

        var roles = await (
            from userRole in _db.UserRoles
            join role in _db.Roles on userRole.RoleId equals role.Id
            where userRole.UserId == employee.UserId
            select role.Name!
        ).ToListAsync();

        return (employee, roles);
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