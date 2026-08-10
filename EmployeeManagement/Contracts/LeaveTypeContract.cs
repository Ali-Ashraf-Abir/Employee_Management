using EmployeeManagement.Core.Contracts;
using EmployeeManagement.Models;

namespace EmployeeManagement.Contracts;

public class LeaveTypeContract
    : BaseContract<LeaveTypeContract, LeaveType>
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public int AnnualLimit { get; set; }

    public bool IsActive { get; set; }
}