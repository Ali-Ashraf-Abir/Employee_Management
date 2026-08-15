using EmployeeManagement.Hubs;
using EmployeeManagement.Models;
using EmployeeManagement.Models.Interfaces;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace EmployeeManagement.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(
        INotificationRepository notificationRepository,
        IEmployeeRepository employeeRepository,
        IHubContext<NotificationHub> hubContext)
    {
        _notificationRepository = notificationRepository;
        _employeeRepository = employeeRepository;
        _hubContext = hubContext;
    }
    public async Task<List<Notification>> GetByUserIdAsync(
        Guid userId)
    {
        return await _notificationRepository
            .GetByUserIdAsync(userId);
    }

    public async Task MarkAsReadAsync(
        Guid notificationId,
        Guid userId)
    {
        await _notificationRepository.MarkAsReadAsync(
            notificationId,
            userId);

        await _notificationRepository.SaveChangesAsync();
    }

    public async Task MarkAllAsReadAsync(
        Guid userId)
    {
        await _notificationRepository.MarkAllAsReadAsync(
            userId);
    }
    public async Task NotifyAllEmployeesAsync(
    string title,
    string message,
    string type,
    Guid? referenceId = null,
    Guid? excludeUserId = null)
    {
        var users = await _employeeRepository
            .GetUsersByRolesAsync(["Employee"]);

        await NotifyUsersAsync(
            users,
            title,
            message,
            type,
            referenceId,
            excludeUserId);
    }
    public async Task NotifyEmployeeAsync(
        Guid employeeId,
        string title,
        string message,
        string type,
        Guid? referenceId = null,
        Guid? excludeUserId = null)
    {
        var user =
            await _employeeRepository
                .GetUserByEmployeeIdAsync(employeeId);

        if (user == null)
            return;

        await NotifyUsersAsync(
            [user],
            title,
            message,
            type,
            referenceId,
            excludeUserId);
    }

    public async Task NotifyHrAndAdminsAsync(
        string title,
        string message,
        string type,
        Guid? referenceId = null,
        Guid? excludeUserId = null)
    {
        var users =
            await _employeeRepository.GetUsersByRolesAsync(
                ["HR", "Admin"]);

        await NotifyUsersAsync(
            users,
            title,
            message,
            type,
            referenceId,
            excludeUserId);
    }


    private async Task NotifyUsersAsync(
    IEnumerable<ApplicationUser> users,
    string title,
    string message,
    string type,
    Guid? referenceId,
    Guid? excludeUserId = null)
    {
        foreach (var user in users)
        {
            if (excludeUserId.HasValue &&
                user.Id == excludeUserId.Value)
            {
                continue;
            }

            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Title = title,
                Message = message,
                Type = type,
                ReferenceId = referenceId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationRepository.AddAsync(
                notification);

            await _hubContext.Clients
                .User(user.Id.ToString())
                .SendAsync(
                    "NotificationReceived",
                    notification);
        }

        await _notificationRepository.SaveChangesAsync();
    }
}