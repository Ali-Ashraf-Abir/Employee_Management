using EmployeeManagement.Contracts;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Apis;

[ApiController]
[Route("api/admin/employees")]
[Authorize(Policy = "AdminOnly")]
public class EmployeeApi : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeeApi(IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var employees =
            await _employeeService.GetAllAsync();
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


}