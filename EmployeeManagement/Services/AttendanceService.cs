using AutoMapper;
using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Contracts;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Repositories;

public class AttendanceService : IAttendanceService
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public AttendanceService(ApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<AttendanceResponse> EnterAsync(Guid userId)
    {
        using var factory = new RepositoryFactory(_db);
        var employeeRepository = factory.CreateEmployeeRepository();
        var attendanceRepository = factory.CreateAttendanceRepository();

        var employee = await employeeRepository.GetByUserIdAsync(userId);

        if (employee == null)
            throw new Exception("Employee not found.");

        var openRecord = await attendanceRepository.GetOpenRecordAsync(employee.Id);

        if (openRecord != null)
            throw new Exception("Employee is already checked in.");

        var attendance = new AttendanceRecord
        {
            Id = Guid.NewGuid(),
            EmployeeId = employee.Id,
            EnteredAt = DateTime.UtcNow
        };

        await attendanceRepository.AddAsync(attendance);
        await attendanceRepository.SaveChangesAsync();

        attendance.Employee = employee;

        return _mapper.Map<AttendanceResponse>(attendance);
    }

    public async Task<AttendanceResponse> LeaveAsync(Guid userId)
    {
        using var factory = new RepositoryFactory(_db);
        var employeeRepository = factory.CreateEmployeeRepository();
        var attendanceRepository = factory.CreateAttendanceRepository();

        var employee = await employeeRepository.GetByUserIdAsync(userId);

        if (employee == null)
            throw new Exception("Employee not found.");

        var attendance = await attendanceRepository.GetOpenRecordAsync(employee.Id);

        if (attendance == null)
            throw new Exception("Employee is not currently checked in.");

        attendance.LeftAt = DateTime.UtcNow;

        attendanceRepository.Update(attendance);
        await attendanceRepository.SaveChangesAsync();

        attendance.Employee = employee;

        return _mapper.Map<AttendanceResponse>(attendance);
    }

    public async Task<PagedResult<AttendanceResponse>> GetMineAsync(Guid userId, AttendanceQuery query)
    {
        using var factory = new RepositoryFactory(_db);
        var employeeRepository = factory.CreateEmployeeRepository();
        var attendanceRepository = factory.CreateAttendanceRepository();

        var employee = await employeeRepository.GetByUserIdAsync(userId);

        if (employee == null)
            throw new Exception("Employee not found.");

        var result = await attendanceRepository.GetHistoryAsync(employee.Id, query);

        return new PagedResult<AttendanceResponse>
        {
            Items = _mapper.Map<IEnumerable<AttendanceResponse>>(result.Items),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = result.TotalCount
        };
    }

    public async Task<PagedResult<AttendanceResponse>> GetHistoryAsync(AttendanceQuery query)
    {
        using var factory = new RepositoryFactory(_db);
        var attendanceRepository = factory.CreateAttendanceRepository();

        var result = await attendanceRepository.GetHistoryAsync(null, query);

        return new PagedResult<AttendanceResponse>
        {
            Items = _mapper.Map<IEnumerable<AttendanceResponse>>(result.Items),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = result.TotalCount
        };
    }

    public async Task<PagedResult<AttendanceDailyResponse>> GetDailyReportAsync(AttendanceQuery query)
    {
        using var factory = new RepositoryFactory(_db);
        var attendanceRepository = factory.CreateAttendanceRepository();

        var result = await attendanceRepository.GetDailyReportAsync(query);

        return new PagedResult<AttendanceDailyResponse>
        {
            Items = _mapper.Map<IEnumerable<AttendanceDailyResponse>>(result.Items),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = result.TotalCount
        };
    }
}