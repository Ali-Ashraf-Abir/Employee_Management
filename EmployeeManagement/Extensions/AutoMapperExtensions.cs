using EmployeeManagement.Core.Mapping;

namespace EmployeeManagement.Extensions;

public static class AutoMapperExtensions
{
    public static IServiceCollection AddAutoMapperConfiguration(
        this IServiceCollection services)
    {
        services.AddAutoMapper(
            cfg => { },
            typeof(EmployeeProfile));

        return services;
    }
}