using EmployeeManagement.Repositories;
using EmployeeManagement.Repositories.Interfaces;
using EmployeeManagement.Services;
using EmployeeManagement.Services.Interfaces;

namespace EmployeeManagement.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services)
    {
        services.AddScoped<
            IEmployeeService,
            EmployeeService>();

        services.AddScoped<
            IEmployeeRepository,
            EmployeeRepository>();

        services.AddScoped<
            IAuthService,
            AuthService>();

        services.AddScoped<
            IJwtService,
            JwtService>();

        services.AddScoped<
            ILeaveTypeService,
            LeaveTypeService>();

        services.AddScoped<
            ILeaveRequestService, 
            LeaveRequestService>();

        services.AddScoped<
            IAttendanceService, 
            AttendanceService>();

        return services;
    }
}