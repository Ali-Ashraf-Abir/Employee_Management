using EmployeeManagement.Contracts;
using EmployeeManagement.Core.Contracts;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Apis;

[ApiController]
[Route("api/admin/employees")]
[Authorize(Policy = "AdminOrHROnly")]
public class EmployeeAdminApi : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeeAdminApi(IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PaginationQuery query)
    {
        var employees = await _employeeService.GetAllAsync(query);

        return Ok(employees);
    }
    [HttpGet]
    [Route("{id:guid}")]
    public async Task<IActionResult> GetById(
        Guid id)
    {
        var employee = await _employeeService.GetByIdAsync(id);
        if (employee == null)
            return NotFound();
        return Ok(employee);
    }
    [HttpPost]
    public async Task<IActionResult> Create(
        EmployeeContract contract)
    {
        var employee = await _employeeService.CreateAsync(contract);
        return Ok(employee);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        EmployeeUpdateContract contract)
    {
        var employee =await _employeeService.UpdateAsync(id,contract);
        if (employee == null)
            return NotFound();

        return Ok(employee);
    }

    [HttpPatch("{id:guid}/disable")]
    public async Task<IActionResult> Disable(
        Guid id)
    {
        var result = await _employeeService.DisableAsync(id);

        if (!result)
            return NotFound();

        return Ok();
    }
    [HttpPatch("{id:guid}/enable")]
    public async Task<IActionResult> Enable(Guid id)
    {
        var result = await _employeeService.EnableAsync(id);

        if (!result)
            return NotFound();

        return Ok();
    }
    [HttpPut("{id:guid}/roles")]
    public async Task<IActionResult> UpdateRoles(Guid id, UpdateUserRolesContract contract)
    {
        var result = await _employeeService.UpdateRolesAsync(id, contract.Roles);

        if (!result)
            return NotFound();

        return NoContent();
    }


}