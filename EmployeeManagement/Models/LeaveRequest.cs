namespace EmployeeManagement.Models;

public class LeaveRequest
{
    public Guid Id { get; set; }

    public Guid EmployeeId { get; set; }

    public Guid LeaveTypeId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int Days { get; set; }

    public LeaveStatus Status { get; set; }

    public string? Reason { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public Guid? ReviewedBy { get; set; }

    public Employee Employee { get; set; } = null!;

    public LeaveType LeaveType { get; set; } = null!;

    public bool IsDeleted { get; set; } = false;
}