using EmployeeManagement.Data;

namespace EmployeeManagement.Extensions;

public static class SeedExtensions
{
    public static async Task SeedIdentity(
        this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        await IdentitySeeder.SeedAsync(
            scope.ServiceProvider);
    }
}