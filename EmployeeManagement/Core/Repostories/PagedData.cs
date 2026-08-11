namespace EmployeeManagement.Core.Repositories;

public class PagedData<T>
{
    public IEnumerable<T> Items { get; set; } = [];
    public int TotalCount { get; set; }
}