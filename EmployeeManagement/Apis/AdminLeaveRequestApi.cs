using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Contracts;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeManagement.Apis;

[ApiController]
[Route("api/leave/requests")]
[Authorize(Policy = "AdminOrHROnly")]
public class AdminLeaveRequestApi : ControllerBase
{
    private readonly ILeaveRequestService _leaveRequestService;

    public AdminLeaveRequestApi(
        ILeaveRequestService leaveRequestService)
    {
        _leaveRequestService = leaveRequestService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] PaginationQuery query)
    {
        var requests =
            await _leaveRequestService.GetAllAsync(query);

        return Ok(requests);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var request =
            await _leaveRequestService.GetByIdAsync(id);

        if (request == null)
            return NotFound();

        return Ok(request);
    }

    [HttpPut("{id:guid}/approve")]
    public async Task<IActionResult> Approve(Guid id)
    {
        var adminId = Guid.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);

        var result =
            await _leaveRequestService.ApproveAsync(
                adminId,
                id);

        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPut("{id:guid}/reject")]
    public async Task<IActionResult> Reject(Guid id)
    {
        var adminId = Guid.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);

        var result =
            await _leaveRequestService.RejectAsync(
                adminId,
                id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}