using AutoMapper;
using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Contracts;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Repositories;
using EmployeeManagement.Services.Interfaces;
using EmployeeManagement.Exceptions;


namespace EmployeeManagement.Services;

public class LeaveRequestService : ILeaveRequestService
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;
    private readonly ILeaveBalanceService _leaveBalanceService;
    public LeaveRequestService(
        ApplicationDbContext db,
        IMapper mapper,
        ILeaveBalanceService leaveBalanceService)
    {
        _db = db;
        _mapper = mapper;
        _leaveBalanceService = leaveBalanceService;
    }

    public async Task<LeaveRequestResponse> CreateAsync(
        Guid userId,
        LeaveRequestContract contract)
    {
        using var factory = new RepositoryFactory(_db);

        var employeeRepository = factory.CreateEmployeeRepository();
        var leaveTypeRepository = factory.CreateLeaveTypeRepository();
        var balanceRepository = factory.CreateEmployeeLeaveBalanceRepository();
        var leaveRequestRepository = factory.CreateLeaveRequestRepository();

        var employee = await employeeRepository.GetByUserIdAsync(userId);

        if (employee == null)
            throw new BusinessException("Employee not found.");

        var leaveType = await leaveTypeRepository.GetByIdAsync(
            contract.LeaveTypeId);

        if (leaveType == null)
            throw new BusinessException("Leave type not found.");

        if (!leaveType.IsActive)
            throw new BusinessException("This leave type is not active.");

        ValidateDates(
            contract.StartDate,
            contract.EndDate);

        var days = CalculateDays(
            contract.StartDate,
            contract.EndDate);

        var year = contract.StartDate.Year;

        var availableDays = await _leaveBalanceService.GetAvailableDaysAsync(employee.Id, leaveType.Id, year);

        if (days > availableDays)
        {
            throw new BusinessException(
    $"You only have {availableDays} days available for this leave type.");
        }

        var leaveRequest = contract.ToModel(_mapper);

        leaveRequest.Id = Guid.NewGuid();
        leaveRequest.EmployeeId = employee.Id;
        leaveRequest.Days = days;
        leaveRequest.Status = LeaveStatus.Pending;
        leaveRequest.CreatedAt = DateTime.UtcNow;

        await leaveRequestRepository.AddAsync(leaveRequest);
        await leaveRequestRepository.SaveChangesAsync();

        leaveRequest.LeaveType = leaveType;

        return _mapper.Map<LeaveRequestResponse>(leaveRequest);
    }
    public async Task<PagedResult<LeaveRequestResponse>> GetAllAsync(PaginationQuery query)
    {
        using var factory = new RepositoryFactory(_db);
        var leaveRequestRepository = factory.CreateLeaveRequestRepository();

        var result = await leaveRequestRepository.GetPagedAsync(
            query.Search,
            query.Page,
            query.PageSize);

        return new PagedResult<LeaveRequestResponse>
        {
            Items = _mapper.Map<IEnumerable<LeaveRequestResponse>>(result.Items),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = result.TotalCount
        };
    }
    public async Task<LeaveRequestResponse?> GetByIdAsync(
        Guid userId,
        Guid id)
    {
        using var factory = new RepositoryFactory(_db);

        var employeeRepository = factory.CreateEmployeeRepository();
        var leaveRequestRepository = factory.CreateLeaveRequestRepository();

        var employee = await employeeRepository.GetByUserIdAsync(userId);

        if (employee == null)
            return null;

        var leaveRequest =
            await leaveRequestRepository.GetByIdAndEmployeeIdAsync(
                id,
                employee.Id);

        if (leaveRequest == null)
            return null;

        return _mapper.Map<LeaveRequestResponse>(leaveRequest);
    }

    public async Task<PagedResult<LeaveRequestResponse>> GetMineAsync(Guid userId, PaginationQuery query)
    {
        using var factory = new RepositoryFactory(_db);
        var employeeRepository = factory.CreateEmployeeRepository();
        var leaveRequestRepository = factory.CreateLeaveRequestRepository();

        var employee = await employeeRepository.GetByUserIdAsync(userId);

        if (employee == null)
            throw new BusinessException("Employee not found.");

        var result = await leaveRequestRepository.GetPagedByEmployeeIdAsync(
            employee.Id,
            query.Search,
            query.Page,
            query.PageSize);

        return new PagedResult<LeaveRequestResponse>
        {
            Items = _mapper.Map<IEnumerable<LeaveRequestResponse>>(result.Items),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = result.TotalCount
        };
    }

    public async Task<LeaveRequestResponse?> UpdateAsync(
        Guid userId,
        Guid id,
        LeaveRequestContract contract)
    {
        using var factory = new RepositoryFactory(_db);

        var employeeRepository = factory.CreateEmployeeRepository();
        var leaveRequestRepository = factory.CreateLeaveRequestRepository();
        var leaveTypeRepository = factory.CreateLeaveTypeRepository();
        var balanceRepository = factory.CreateEmployeeLeaveBalanceRepository();

        var employee = await employeeRepository.GetByUserIdAsync(userId);

        if (employee == null)
            return null;

        var leaveRequest =
            await leaveRequestRepository.GetByIdAndEmployeeIdAsync(
                id,
                employee.Id);

        if (leaveRequest == null)
            return null;

        if (leaveRequest.Status != LeaveStatus.Pending)
            throw new BusinessException(
                "Reviewed leave requests cannot be edited.");

        var leaveType = await leaveTypeRepository.GetByIdAsync(
            contract.LeaveTypeId);

        if (leaveType == null)
            throw new BusinessException("Leave type not found.");

        if (!leaveType.IsActive)
            throw new BusinessException("This leave type is not active.");

        ValidateDates(
            contract.StartDate,
            contract.EndDate);

        var days = CalculateDays(
            contract.StartDate,
            contract.EndDate);

        var year = contract.StartDate.Year;

        var availableDays = await _leaveBalanceService.GetAvailableDaysAsync(employee.Id, leaveType.Id, year, leaveRequest.Id);

        if (days > availableDays)
        {
            throw new BusinessException(
                $"You only have {availableDays} days available for this leave type.");
        }

        _mapper.Map(contract, leaveRequest);

        leaveRequest.Days = days;

        leaveRequestRepository.Update(leaveRequest);
        await leaveRequestRepository.SaveChangesAsync();

        leaveRequest.LeaveType = leaveType;

        return _mapper.Map<LeaveRequestResponse>(leaveRequest);
    }

    public async Task<bool> DeleteAsync(
        Guid userId,
        Guid id)
    {
        using var factory = new RepositoryFactory(_db);

        var employeeRepository = factory.CreateEmployeeRepository();
        var leaveRequestRepository = factory.CreateLeaveRequestRepository();

        var employee = await employeeRepository.GetByUserIdAsync(userId);

        if (employee == null)
            return false;

        var leaveRequest =
            await leaveRequestRepository.GetByIdAndEmployeeIdAsync(
                id,
                employee.Id);

        if (leaveRequest == null)
            return false;

        if (leaveRequest.Status != LeaveStatus.Pending)
            throw new BusinessException(
                "Reviewed leave requests cannot be deleted.");

        leaveRequest.IsDeleted = true;

        await leaveRequestRepository.SaveChangesAsync();

        return true;
    }

    private static int CalculateDays(
        DateTime startDate,
        DateTime endDate)
    {
        return (endDate.Date - startDate.Date).Days + 1;
    }

    private static void ValidateDates(
        DateTime startDate,
        DateTime endDate)
    {
        if (endDate.Date < startDate.Date)
            throw new BusinessException(
                "End date cannot be before start date.");

        if (startDate.Year != endDate.Year)
            throw new BusinessException(
                "A leave request must be within the same calendar year.");
    }
    public async Task<bool> ApproveAsync(
    Guid adminId,
    Guid leaveRequestId)
    {
        using var factory = new RepositoryFactory(_db);

        var leaveRequestRepository =
            factory.CreateLeaveRequestRepository();

        var balanceRepository =
            factory.CreateEmployeeLeaveBalanceRepository();

        var leaveRequest =
            await leaveRequestRepository.GetByIdAsync(
                leaveRequestId);

        if (leaveRequest == null)
            return false;

        if (leaveRequest.Status != LeaveStatus.Pending)
            throw new BusinessException(
                "Only pending leave requests can be approved.");

        var year = leaveRequest.StartDate.Year;

        var balance =
            await balanceRepository.GetAsync(
                leaveRequest.EmployeeId,
                leaveRequest.LeaveTypeId,
                year);

        if (balance == null)
        {
            balance = new EmployeeLeaveBalance
            {
                Id = Guid.NewGuid(),
                EmployeeId = leaveRequest.EmployeeId,
                LeaveTypeId = leaveRequest.LeaveTypeId,
                Year = year,
                ConsumedDays = leaveRequest.Days
            };

            await balanceRepository.AddAsync(balance);
        }
        else
        {
            balance.ConsumedDays += leaveRequest.Days;

            balanceRepository.Update(balance);
        }

        leaveRequest.Status = LeaveStatus.Approved;
        leaveRequest.ReviewedAt = DateTime.UtcNow;
        leaveRequest.ReviewedBy = adminId;

        leaveRequestRepository.Update(leaveRequest);

        await leaveRequestRepository.SaveChangesAsync();

        return true;
    }
    public async Task<bool> RejectAsync(
    Guid adminId,
    Guid leaveRequestId)
    {
        using var factory = new RepositoryFactory(_db);

        var leaveRequestRepository =factory.CreateLeaveRequestRepository();

        var leaveRequest =await leaveRequestRepository.GetByIdAsync(leaveRequestId);

        if (leaveRequest == null)
            return false;

        if (leaveRequest.Status != LeaveStatus.Pending)
            throw new BusinessException("Only pending leave requests can be rejected.");

        leaveRequest.Status = LeaveStatus.Rejected;
        leaveRequest.ReviewedAt = DateTime.UtcNow;
        leaveRequest.ReviewedBy = adminId;

        leaveRequestRepository.Update(leaveRequest);

        await leaveRequestRepository.SaveChangesAsync();

        return true;
    }

    public async Task<List<LeaveBalanceResponse>> GetMyBalancesAsync(
    Guid userId,
    int year)
    {
        using var factory = new RepositoryFactory(_db);

        var employeeRepository = factory.CreateEmployeeRepository();
        var leaveTypeRepository = factory.CreateLeaveTypeRepository();
        var balanceRepository = factory.CreateEmployeeLeaveBalanceRepository();
        var leaveRequestRepository = factory.CreateLeaveRequestRepository();

        var employee = await employeeRepository.GetByUserIdAsync(userId);

        if (employee == null)
            throw new BusinessException("Employee not found.");

        var leaveTypes = await leaveTypeRepository.GetActiveAsync();

        var result = new List<LeaveBalanceResponse>();

        foreach (var leaveType in leaveTypes)
        {
            var balance = await balanceRepository.GetAsync(
                employee.Id,
                leaveType.Id,
                year);

            var consumedDays = balance?.ConsumedDays ?? 0;

            var pendingDays =
                await leaveRequestRepository.GetPendingDaysAsync(
                    employee.Id,
                    leaveType.Id,
                    year);

            var remainingDays =
                leaveType.AnnualLimit -
                consumedDays -
                pendingDays;

            result.Add(new LeaveBalanceResponse
            {
                LeaveTypeId = leaveType.Id,
                LeaveTypeName = leaveType.Name,
                AnnualLimit = leaveType.AnnualLimit,
                ConsumedDays = consumedDays,
                PendingDays = pendingDays,
                RemainingDays = Math.Max(remainingDays, 0)
            });
        }

        return result;
    }
}