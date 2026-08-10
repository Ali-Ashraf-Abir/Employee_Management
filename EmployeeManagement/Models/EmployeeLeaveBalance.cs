namespace EmployeeManagement.Models;

public class EmployeeLeaveBalance
{
    public Guid Id { get; set; }

    public Guid EmployeeId { get; set; }

    public Guid LeaveTypeId { get; set; }

    public int Year { get; set; }

    public int ConsumedDays { get; set; }

    public Employee Employee { get; set; } = null!;

    public LeaveType LeaveType { get; set; } = null!;
}