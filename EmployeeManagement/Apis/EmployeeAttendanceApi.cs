using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/employee/attendance")]
[Authorize]
public class EmployeeAttendanceApi : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public EmployeeAttendanceApi(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [HttpPost("enter")]
    public async Task<IActionResult> Enter()
    {
        var userId = GetUserId();
        var result = await _attendanceService.EnterAsync(userId);
        return Ok(result);
    }

    [HttpPost("leave")]
    public async Task<IActionResult> Leave()
    {
        var userId = GetUserId();
        var result = await _attendanceService.LeaveAsync(userId);
        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] AttendanceQuery query)
    {
        var userId = GetUserId();
        var result = await _attendanceService.GetMineAsync(userId, query);
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(value, out var userId))
            throw new UnauthorizedAccessException();

        return userId;
    }
}