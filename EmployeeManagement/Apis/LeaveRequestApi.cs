using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Contracts;
using EmployeeManagement.Services;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeManagement.Apis;

[ApiController]
[Route("api/employee/leaves")]

public class LeaveRequestApi : ControllerBase
{
    private readonly ILeaveRequestService _leaveRequestService;
    private readonly ILeaveBalanceService _leaveBalanceService;

    public LeaveRequestApi(
        ILeaveRequestService leaveRequestService,
        ILeaveBalanceService leaveBalanceService)
    {
        _leaveRequestService = leaveRequestService;

        _leaveBalanceService = leaveBalanceService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetMine([FromQuery] PaginationQuery query)
    {
        var userId = GetUserId();
        var requests = await _leaveRequestService.GetMineAsync(userId, query);
        return Ok(requests);
    }


    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetMyLeave(Guid id)
    {
        var userId = GetUserId();

        var result =
            await _leaveRequestService.GetMyByIdAsync(
                userId,
                id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }
    [HttpGet("my-balances")]
    [Authorize]
    public async Task<ActionResult<List<LeaveBalanceResponse>>> GetMyBalances([FromQuery] int? year)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var selectedYear = year ?? DateTime.UtcNow.Year;

        var result = await _leaveBalanceService.GetMyBalancesAsync(userId, selectedYear);

        return Ok(result);
    }
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(
        LeaveRequestContract contract)
    {
        var userId = GetUserId();

        var request =
            await _leaveRequestService.CreateAsync(
                userId,
                contract);

        return Ok(request);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(
        Guid id,
        LeaveRequestContract contract)
    {
        var userId = GetUserId();

        var request =
            await _leaveRequestService.UpdateAsync(
                userId,
                id,
                contract);

        if (request == null)
            return NotFound();

        return Ok(request);
    }
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();

        var result =
            await _leaveRequestService.DeleteAsync(
                userId,
                id);

        if (!result)
            return NotFound();

        return NoContent();
    }



    private Guid GetUserId()
    {
        var value =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(value, out var userId))
            throw new UnauthorizedAccessException();

        return userId;
    }
}