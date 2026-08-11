namespace EmployeeManagement.Models;

public class AttendanceRecord
{
    public Guid Id { get; set; }

    public Guid EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;

    public DateTime EnteredAt { get; set; }
    public DateTime? LeftAt { get; set; }
}