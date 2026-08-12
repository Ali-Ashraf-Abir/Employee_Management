namespace EmployeeManagement.Models.Interfaces;

public interface IRepositoryFactory : IDisposable
{
    IEmployeeRepository CreateEmployeeRepository();

    ILeaveTypeRepository CreateLeaveTypeRepository();

    ILeaveRequestRepository CreateLeaveRequestRepository();
    IEmployeeLeaveBalanceRepository CreateEmployeeLeaveBalanceRepository();
    IAttendanceRepository CreateAttendanceRepository();
    Task<int> CommitAsync();
}