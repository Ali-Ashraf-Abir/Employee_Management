using EmployeeManagement.Models;

public interface INotificationService
{
    Task NotifyAllEmployeesAsync(
        string title,
        string message,
        string type,
        Guid? referenceId = null,
        Guid? excludeUserId = null);

    Task NotifyEmployeeAsync(
        Guid employeeId,
        string title,
        string message,
        string type,
        Guid? referenceId = null,
        Guid? excludeUserId = null);

    Task NotifyHrAndAdminsAsync(
        string title,
        string message,
        string type,
        Guid? referenceId = null,
        Guid? excludeUserId = null);

    Task<List<Notification>> GetByUserIdAsync(
        Guid userId);

    Task MarkAsReadAsync(
        Guid notificationId,
        Guid userId);

    Task MarkAllAsReadAsync(
        Guid userId);
}