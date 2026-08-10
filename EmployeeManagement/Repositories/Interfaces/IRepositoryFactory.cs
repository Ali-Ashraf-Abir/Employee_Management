using EmployeeManagement.Repositories.Interfaces;

namespace EmployeeManagement.Repositories;

public interface IRepositoryFactory : IDisposable
{
    IEmployeeRepository CreateEmployeeRepository();

    ILeaveTypeRepository CreateLeaveTypeRepository();

    Task<int> CommitAsync();
}