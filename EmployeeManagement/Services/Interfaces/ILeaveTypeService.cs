using EmployeeManagement.Contracts;

namespace EmployeeManagement.Services.Interfaces;

public interface ILeaveTypeService
{
    Task<IEnumerable<LeaveTypeContract>> GetAllAsync();

    Task<LeaveTypeContract?> GetByIdAsync(Guid id);

    Task<LeaveTypeContract> CreateAsync(
        LeaveTypeContract contract);

    Task<LeaveTypeContract?> UpdateAsync(
        Guid id,
        LeaveTypeUpdateContract contract);

    Task<bool> DisableAsync(Guid id);

    Task<bool> EnableAsync(Guid id);
}