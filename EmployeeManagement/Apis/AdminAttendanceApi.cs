using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin/attendance")]
[Authorize(Policy = "AdminOrHROnly")]
public class AdminAttendanceApi : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AdminAttendanceApi(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] AttendanceQuery query)
    {
        var result = await _attendanceService.GetHistoryAsync(query);
        return Ok(result);
    }

    [HttpGet("report")]
    public async Task<IActionResult> GetReport([FromQuery] AttendanceQuery query)
    {
        var result = await _attendanceService.GetDailyReportAsync(query);
        return Ok(result);
    }
}