using AutoMapper;
using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Contracts;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Repositories;
using EmployeeManagement.Repositories.Interfaces;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Services;

public class EmployeeService : IEmployeeService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public EmployeeService(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext db,
        IMapper mapper)
    {
        _userManager = userManager;
        _db = db;
        _mapper = mapper;
    }
    public async Task<PagedResult<EmployeeContract>> GetAllAsync(PaginationQuery query)
    {
        using IRepositoryFactory factory = new RepositoryFactory(_db);
        var employeeRepository = factory.CreateEmployeeRepository();

        var result = await employeeRepository.GetPagedAsync(query.Search, query.Page, query.PageSize);
        var employees = result.Items.ToList();
        var userIds = employees.Select(x => x.UserId).ToList();

        var roleData = await (
            from userRole in _db.UserRoles
            join role in _db.Roles on userRole.RoleId equals role.Id
            where userIds.Contains(userRole.UserId)
            select new
            {
                userRole.UserId,
                RoleName = role.Name!
            })
            .ToListAsync();

        var contracts = employees.Select(employee =>
        {
            var contract = EmployeeContract.ToContract(employee, _mapper);
            contract.Roles = roleData
                .Where(x => x.UserId == employee.UserId)
                .Select(x => x.RoleName)
                .ToList();
            return contract;
        }).ToList();

        return new PagedResult<EmployeeContract>
        {
            Items = contracts,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = result.TotalCount
        };
    }
    public async Task<EmployeeContract?> GetByIdAsync(Guid id)
    {
        using IRepositoryFactory factory = new RepositoryFactory(_db);
        var _employeeRepository = factory.CreateEmployeeRepository();
        var employee = await _employeeRepository.GetEmployeeByIdAsync(id);
        if (employee == null)
            return null;
        return EmployeeContract.ToContract(
            employee,
            _mapper);
    }
    public async Task<EmployeeContract> CreateAsync(
        EmployeeContract contract)
    {
        using IRepositoryFactory factory = new RepositoryFactory(_db);
        var _employeeRepository = factory.CreateEmployeeRepository();
        await using var transaction =
            await _db.Database.BeginTransactionAsync();

        try
        {
            
            var user = new ApplicationUser
            {
                UserName = contract.Email,
                Email = contract.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(
                user,
                contract.Password);

            if (!result.Succeeded)
            {
                throw new Exception(
                    string.Join(
                        ", ",
                        result.Errors.Select(x => x.Description)));
            }

            // 2. Assign Employee role
            var roleResult =
                await _userManager.AddToRoleAsync(
                    user,
                    "Employee");

            if (!roleResult.Succeeded)
            {
                throw new Exception(
                    string.Join(
                        ", ",
                        roleResult.Errors.Select(x => x.Description)));
            }

            // 3. Map contract → Employee
            var employee = contract.ToModel(_mapper);

            employee.Id = Guid.NewGuid();
            employee.UserId = user.Id;
            employee.JoinedAt = DateTime.UtcNow;
            employee.EmployeeId = $"EMP-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
            // 4. Add employee to EF
            await _employeeRepository.AddAsync(employee);

            // 5. Save Employee changes
            await _employeeRepository.SaveChangesAsync();

            // 6. Commit everything
            await transaction.CommitAsync();

            // 7. Map Employee → Contract for response
            return EmployeeContract.ToContract(
                employee,
                _mapper);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    public async Task<EmployeeContract?> UpdateAsync(Guid id,EmployeeUpdateContract contract)
    {
        using IRepositoryFactory factory = new RepositoryFactory(_db);
        var _employeeRepository = factory.CreateEmployeeRepository();
        var employee = await _employeeRepository.GetByIdAsync(id);

        if (employee == null)
            return null;

        var user = await _userManager.FindByIdAsync(
            employee.UserId.ToString());

        if (user == null)
            return null;

        await using var transaction =
            await _db.Database.BeginTransactionAsync();

        try
        {
            // Update Identity email
            user.Email = contract.Email;
            user.UserName = contract.Email;

            var userResult =
                await _userManager.UpdateAsync(user);

            if (!userResult.Succeeded)
            {
                throw new Exception(
                    string.Join(
                        ", ",
                        userResult.Errors.Select(
                            x => x.Description)));
            }

            _mapper.Map(contract, employee);
            _employeeRepository.Update(employee);
            await _employeeRepository.SaveChangesAsync();
            await transaction.CommitAsync();

            return EmployeeContract.ToContract(
                employee,
                _mapper);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    public async Task<bool> DisableAsync(Guid id)
    {
        using IRepositoryFactory factory = new RepositoryFactory(_db);
        var _employeeRepository = factory.CreateEmployeeRepository();
        var employee = await _employeeRepository.GetByIdAsync(id);

        if (employee == null)
            return false;

        var user = await _userManager.FindByIdAsync(
            employee.UserId.ToString());

        if (user == null)
            return false;

        var result = await _userManager.SetLockoutEnabledAsync(
            user,
            true);

        if (!result.Succeeded)
        {
            throw new Exception(
                string.Join(
                    ", ",
                    result.Errors.Select(
                        x => x.Description)));
        }

        result = await _userManager.SetLockoutEndDateAsync(
            user,
            DateTimeOffset.MaxValue);

        if (!result.Succeeded)
        {
            throw new Exception(
                string.Join(
                    ", ",
                    result.Errors.Select(
                        x => x.Description)));
        }

        return true;
    }
    public async Task<bool> EnableAsync(Guid id)
    {
        using IRepositoryFactory factory = new RepositoryFactory(_db);
        var _employeeRepository = factory.CreateEmployeeRepository();
        var employee = await _employeeRepository.GetByIdAsync(id);

        if (employee == null)
            return false;

        var user = await _userManager.FindByIdAsync(
            employee.UserId.ToString());

        if (user == null)
            return false;

        var result = await _userManager.SetLockoutEndDateAsync(
            user,
            null);

        if (!result.Succeeded)
        {
            throw new Exception(
                string.Join(
                    ", ",
                    result.Errors.Select(
                        x => x.Description)));
        }

        return true;
    }

    public async Task<bool> UpdateRolesAsync(Guid employeeId, List<string> roles)
    {
        using IRepositoryFactory factory = new RepositoryFactory(_db);
        var employeeRepository = factory.CreateEmployeeRepository();

        var employee = await employeeRepository.GetByIdAsync(employeeId);

        if (employee == null)
            return false;

        var user = await _userManager.FindByIdAsync(employee.UserId.ToString());

        if (user == null)
            return false;

        if (!roles.Contains("Employee"))
            roles.Add("Employee");

        var existingRoles = await _userManager.GetRolesAsync(user);

        var rolesToRemove = existingRoles
            .Except(roles, StringComparer.OrdinalIgnoreCase)
            .ToList();

        var rolesToAdd = roles
            .Except(existingRoles, StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (rolesToRemove.Count > 0)
        {
            var removeResult = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);

            if (!removeResult.Succeeded)
                throw new Exception(string.Join(", ", removeResult.Errors.Select(x => x.Description)));
        }

        if (rolesToAdd.Count > 0)
        {
            var addResult = await _userManager.AddToRolesAsync(user, rolesToAdd);

            if (!addResult.Succeeded)
                throw new Exception(string.Join(", ", addResult.Errors.Select(x => x.Description)));
        }

        return true;
    }
}