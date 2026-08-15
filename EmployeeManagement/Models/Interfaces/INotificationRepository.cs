using EmployeeManagement.Models;

namespace EmployeeManagement.Models.Interfaces;

public interface INotificationRepository
{
    Task AddAsync(Notification notification);
    Task<List<Notification>> GetByUserIdAsync(Guid userId);
    Task<Notification?> GetByIdAsync(Guid id);
    Task SaveChangesAsync();
    Task MarkAsReadAsync(Guid id,Guid userId);

    Task MarkAllAsReadAsync(Guid userId);
}