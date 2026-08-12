using EmployeeManagement.Contracts;
using EmployeeManagement.Data;
using EmployeeManagement.Repositories;
using EmployeeManagement.Services.Interfaces;

namespace EmployeeManagement.Services;

public class LeaveBalanceService : ILeaveBalanceService
{
    private readonly ApplicationDbContext _db;

    public LeaveBalanceService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<int> GetAvailableDaysAsync(Guid employeeId, Guid leaveTypeId, int year, Guid? excludeRequestId = null)
    {
        using var factory = new RepositoryFactory(_db);

        var leaveTypeRepository = factory.CreateLeaveTypeRepository();
        var balanceRepository = factory.CreateEmployeeLeaveBalanceRepository();
        var leaveRequestRepository = factory.CreateLeaveRequestRepository();

        var leaveType = await leaveTypeRepository.GetByIdAsync(leaveTypeId);

        if (leaveType == null)
            throw new Exception("Leave type not found.");

        var balance = await balanceRepository.GetAsync(employeeId, leaveTypeId, year);

        var consumedDays = balance?.ConsumedDays ?? 0;

        var pendingDays = await leaveRequestRepository.GetPendingDaysAsync(employeeId, leaveTypeId, year, excludeRequestId);

        return Math.Max(leaveType.AnnualLimit - consumedDays - pendingDays, 0);
    }

    public async Task<List<LeaveBalanceResponse>> GetMyBalancesAsync(Guid userId, int year)
    {
        using var factory = new RepositoryFactory(_db);

        var employeeRepository = factory.CreateEmployeeRepository();
        var leaveTypeRepository = factory.CreateLeaveTypeRepository();
        var balanceRepository = factory.CreateEmployeeLeaveBalanceRepository();
        var leaveRequestRepository = factory.CreateLeaveRequestRepository();

        var employee = await employeeRepository.GetByUserIdAsync(userId);

        if (employee == null)
            throw new Exception("Employee not found.");

        var leaveTypes = await leaveTypeRepository.GetActiveAsync();

        var result = new List<LeaveBalanceResponse>();

        foreach (var leaveType in leaveTypes)
        {
            var balance = await balanceRepository.GetAsync(employee.Id, leaveType.Id, year);
            var consumedDays = balance?.ConsumedDays ?? 0;
            var pendingDays = await leaveRequestRepository.GetPendingDaysAsync(employee.Id, leaveType.Id, year);
            var remainingDays = Math.Max(leaveType.AnnualLimit - consumedDays - pendingDays, 0);

            result.Add(new LeaveBalanceResponse
            {
                LeaveTypeId = leaveType.Id,
                LeaveTypeName = leaveType.Name,
                AnnualLimit = leaveType.AnnualLimit,
                ConsumedDays = consumedDays,
                PendingDays = pendingDays,
                RemainingDays = remainingDays
            });
        }

        return result;
    }
}