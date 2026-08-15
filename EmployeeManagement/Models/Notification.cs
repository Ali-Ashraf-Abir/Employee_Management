namespace EmployeeManagement.Models;

public class Notification
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;

    public string Type { get; set; } = null!;

    public Guid? ReferenceId { get; set; }

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }

    public ApplicationUser User { get; set; } = null!;
}