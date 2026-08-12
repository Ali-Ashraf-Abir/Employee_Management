using Microsoft.AspNetCore.Identity;
namespace EmployeeManagement.Models;
public class ApplicationRole : IdentityRole<Guid>
{
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}