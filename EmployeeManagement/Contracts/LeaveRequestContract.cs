using EmployeeManagement.Core.Contracts;
using EmployeeManagement.Models;

namespace EmployeeManagement.Contracts;

public class LeaveRequestContract
    : BaseContract<LeaveRequestContract, LeaveRequest>
{
    public Guid LeaveTypeId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string? Reason { get; set; }
}