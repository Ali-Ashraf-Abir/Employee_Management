using EmployeeManagement.Models;

namespace EmployeeManagement.Contracts;

public class AttendanceResponse
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeCode { get; set; } = null!;
    public string EmployeeName { get; set; } = null!;
    public DateTime EnteredAt { get; set; }
    public DateTime? LeftAt { get; set; }
}