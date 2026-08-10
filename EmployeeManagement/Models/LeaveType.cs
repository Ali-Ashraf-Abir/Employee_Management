namespace EmployeeManagement.Models;

public class LeaveType
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public int AnnualLimit { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<LeaveRequest> LeaveRequests { get; set; }
        = new List<LeaveRequest>();
}