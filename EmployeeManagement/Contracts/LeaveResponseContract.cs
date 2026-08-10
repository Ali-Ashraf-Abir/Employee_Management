using EmployeeManagement.Models;

namespace EmployeeManagement.Contracts;

public class LeaveRequestResponse
{
    public Guid Id { get; set; }

    public Guid LeaveTypeId { get; set; }

    public string LeaveTypeName { get; set; } = null!;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int Days { get; set; }

    public LeaveStatus Status { get; set; }

    public string? Reason { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }
}