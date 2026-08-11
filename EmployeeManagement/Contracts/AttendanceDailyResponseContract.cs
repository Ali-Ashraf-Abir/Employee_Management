namespace EmployeeManagement.Contracts;

public class AttendanceDailyResponse
{
    public Guid EmployeeId { get; set; }
    public string EmployeeCode { get; set; } = null!;
    public string EmployeeName { get; set; } = null!;
    public DateTime Date { get; set; }
    public DateTime? FirstEntry { get; set; }
    public DateTime? LastExit { get; set; }
    public int TotalMinutes { get; set; }
    public bool IsCurrentlyInside { get; set; }
    public List<AttendanceResponse> Sessions { get; set; } = [];
}