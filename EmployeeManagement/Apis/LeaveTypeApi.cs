using EmployeeManagement.Contracts;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Apis;

[ApiController]
[Route("api/admin/leave-types")]

public class LeaveTypeApi : ControllerBase
{
    private readonly ILeaveTypeService _leaveTypeService;

    public LeaveTypeApi(
        ILeaveTypeService leaveTypeService)
    {
        _leaveTypeService = leaveTypeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var leaveTypes =await _leaveTypeService.GetAllAsync();

        return Ok(leaveTypes);
    }

    [HttpGet("{id:guid}")]
    
    public async Task<IActionResult> GetById(
        Guid id)
    {
        var leaveType = await _leaveTypeService.GetByIdAsync(id);

        if (leaveType == null)
            return NotFound();

        return Ok(leaveType);
    }

    [HttpPost]
    [Authorize(Policy = "AdminOrHROnly")]
    public async Task<IActionResult> Create(
        LeaveTypeContract contract)
    {
        var leaveType = await _leaveTypeService.CreateAsync(
                contract);

        return Ok(leaveType);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "AdminOrHROnly")]
    public async Task<IActionResult> Update(Guid id,LeaveTypeUpdateContract contract)
    {
        var leaveType =await _leaveTypeService.UpdateAsync(id,contract);
        if (leaveType == null)
            return NotFound();

        return Ok(leaveType);
    }

    [HttpPatch("{id:guid}/disable")]
    [Authorize(Policy = "AdminOrHROnly")]
    public async Task<IActionResult> Disable(
        Guid id)
    {
        var result = await _leaveTypeService.DisableAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPatch("{id:guid}/enable")]
    [Authorize(Policy = "AdminOrHROnly")]
    public async Task<IActionResult> Enable(Guid id)
    {
        var result =await _leaveTypeService.EnableAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}