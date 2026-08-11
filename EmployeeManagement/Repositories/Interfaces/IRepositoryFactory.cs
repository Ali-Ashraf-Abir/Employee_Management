using EmployeeManagement.Repositories.Interfaces;

namespace EmployeeManagement.Repositories;

public interface IRepositoryFactory : IDisposable
{
    IEmployeeRepository CreateEmployeeRepository();

    ILeaveTypeRepository CreateLeaveTypeRepository();

    ILeaveRequestRepository CreateLeaveRequestRepository();
    IEmployeeLeaveBalanceRepository CreateEmployeeLeaveBalanceRepository();
    IAttendanceRepository CreateAttendanceRepository();
    Task<int> CommitAsync();
}