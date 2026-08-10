using EmployeeManagement.Core.Contracts;
using EmployeeManagement.Models;

namespace EmployeeManagement.Contracts;

public class EmployeeUpdateContract
    : BaseContract<EmployeeUpdateContract, Employee>
{
    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Department { get; set; } = null!;

    public string Position { get; set; } = null!;
}