public class EmployeeIdGenerator
{
    public string Generate()
    {
        return $"EMP-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
    }
}