using EmployeeManagement.Core.Contracts;

public class AttendanceQuery : PaginationQuery
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}