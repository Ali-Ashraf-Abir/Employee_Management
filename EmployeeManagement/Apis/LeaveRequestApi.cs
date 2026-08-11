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

    public LeaveRequestApi(
        ILeaveRequestService leaveRequestService)
    {
        _leaveRequestService = leaveRequestService;
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
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetUserId();

        var request =
            await _leaveRequestService.GetByIdAsync(
                userId,
                id);

        if (request == null)
            return NotFound();

        return Ok(request);
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

    //admin only routes

    [HttpGet("all")]
    [Authorize(Policy = "AdminOrHROnly")]
    public async Task<IActionResult> GetAll([FromQuery] PaginationQuery query)
    {
        var requests = await _leaveRequestService.GetAllAsync(query);
        return Ok(requests);
    }
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "AdminOrHROnly")]
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

    [HttpPut("{id:guid}/approve")]
    [Authorize(Policy = "AdminOrHROnly")]
    public async Task<IActionResult> Approve(Guid id)
    {
        var adminId = Guid.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var result =
            await _leaveRequestService.ApproveAsync(
                adminId,
                id);

        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPut("{id:guid}/reject")]
    [Authorize(Policy = "AdminOrHROnly")]
    public async Task<IActionResult> Reject(Guid id)
    {
        var adminId = Guid.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var result =
            await _leaveRequestService.RejectAsync(
                adminId,
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