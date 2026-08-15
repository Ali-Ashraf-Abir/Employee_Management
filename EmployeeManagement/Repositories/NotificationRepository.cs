using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories;

public class NotificationRepository
    : INotificationRepository
{
    private readonly ApplicationDbContext _db;

    public NotificationRepository(
        ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(
        Notification notification)
    {
        await _db.Notifications.AddAsync(
            notification);
    }

    public async Task<List<Notification>> GetByUserIdAsync(
        Guid userId)
    {
        return await _db.Notifications
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<Notification?> GetByIdAsync(
        Guid id)
    {
        return await _db.Notifications
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }

    public async Task MarkAsReadAsync(
    Guid id,
    Guid userId)
{
    var notification =
        await _db.Notifications
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.UserId == userId);

    if (notification == null)
        return;

    notification.IsRead = true;
}

public async Task MarkAllAsReadAsync(
    Guid userId)
{
    await _db.Notifications
        .Where(x =>
            x.UserId == userId &&
            !x.IsRead)
        .ExecuteUpdateAsync(setters =>
            setters.SetProperty(
                x => x.IsRead,
                true));
}

}