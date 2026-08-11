using EmployeeManagement.Data;
using EmployeeManagement.Repositories.Interfaces;

namespace EmployeeManagement.Repositories;

public class RepositoryFactory : IRepositoryFactory
{
    private readonly ApplicationDbContext _db;

    public RepositoryFactory(ApplicationDbContext db)
    {
        _db = db;
    }

    public IEmployeeRepository CreateEmployeeRepository()
        => new EmployeeRepository(_db);

    public ILeaveTypeRepository CreateLeaveTypeRepository()
        => new LeaveTypeRepository(_db);
    public ILeaveRequestRepository CreateLeaveRequestRepository()
        => new LeaveRequestRepository(_db);
    public IEmployeeLeaveBalanceRepository CreateEmployeeLeaveBalanceRepository()
        => new EmployeeLeaveBalanceRepository(_db);
    public IAttendanceRepository CreateAttendanceRepository()
    => new AttendanceRepository(_db);
    public async Task<int> CommitAsync()
        => await _db.SaveChangesAsync();

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        // ApplicationDbContext is managed by ASP.NET Core DI.
    }
}