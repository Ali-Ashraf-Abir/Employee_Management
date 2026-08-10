namespace EmployeeManagement.Models;

public class Employee
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;

    public string Department { get; set; } = null!;

    public string Position { get; set; } = null!;

    public DateTime JoinedAt { get; set; }

    public ApplicationUser User { get; set; } = null!;
}