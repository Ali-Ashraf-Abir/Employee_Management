using AutoMapper;
using EmployeeManagement.Contracts;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Repositories.Interfaces;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace EmployeeManagement.Services;

public class EmployeeService : IEmployeeService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public EmployeeService(
        UserManager<ApplicationUser> userManager,
        IEmployeeRepository employeeRepository,
        ApplicationDbContext db,
        IMapper mapper)
    {
        _userManager = userManager;
        _employeeRepository = employeeRepository;
        _db = db;
        _mapper = mapper;
    }

    public async Task<EmployeeContract> CreateAsync(
        EmployeeContract contract)
    {
        await using var transaction =
            await _db.Database.BeginTransactionAsync();

        try
        {
            // 1. Create Identity user
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
}