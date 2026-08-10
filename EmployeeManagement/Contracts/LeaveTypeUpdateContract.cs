using EmployeeManagement.Core.Contracts;
using EmployeeManagement.Models;

public class LeaveTypeUpdateContract
    : BaseContract<LeaveTypeUpdateContract, LeaveType>
{
    public string Name { get; set; } = null!;

    public int AnnualLimit { get; set; }
}