using EmployeeManagement.Models.Interfaces;
using EmployeeManagement.Repositories;
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
            IAuthRepository,
            AuthRepository>();
        services.AddScoped<
            IAuthService,
            AuthService>();
        services.AddScoped<
            INotificationRepository,
            NotificationRepository>();

        services.AddScoped<
            INotificationService,
            NotificationService>();
            
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
        services.AddScoped<
            ILeaveBalanceService,
            LeaveBalanceService>();
        services.AddScoped<
            EmployeeIdGenerator>();
        return services;
    }
}