using EmployeeManagement.Models;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeManagement.Apis;

[ApiController]
[Authorize]
[Route("api/notifications")]
public class NotificationApi : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationApi(
        INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Notification>>> GetNotifications()
    {
        var userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var notifications =
            await _notificationService
                .GetByUserIdAsync(userId);

        return Ok(notifications);
    }
    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(
    Guid id)
    {
        var userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        await _notificationService.MarkAsReadAsync(
            id,
            userId);

        return NoContent();
    }

    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        await _notificationService.MarkAllAsReadAsync(
            userId);

        return NoContent();
    }
}