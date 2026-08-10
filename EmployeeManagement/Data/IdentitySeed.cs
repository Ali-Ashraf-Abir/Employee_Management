
using EmployeeManagement.Models;
using Microsoft.AspNetCore.Identity;

namespace EmployeeManagement.Data;

public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager =
            services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        var userManager =
            services.GetRequiredService<UserManager<ApplicationUser>>();

        // Create roles
        string[] roles =
        [
            "Admin",
            "Employee"
        ];

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                var result = await roleManager.CreateAsync(
                    new IdentityRole<Guid>
                    {
                        Name = role
                    });

                if (!result.Succeeded)
                {
                    throw new Exception(
                        $"Failed to create role {role}: " +
                        string.Join(", ",
                            result.Errors.Select(x => x.Description)));
                }
            }
        }

        // Create admin
        const string email = "admin@employee.com";
        const string password = "Admin123!";

        var admin = await userManager.FindByEmailAsync(email);

        if (admin == null)
        {
            admin = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(
                admin,
                password);

            if (!result.Succeeded)
            {
                throw new Exception(
                    "Failed to create admin: " +
                    string.Join(", ",
                        result.Errors.Select(x => x.Description)));
            }
        }

        // Make sure admin has Admin role
        if (!await userManager.IsInRoleAsync(admin, "Admin"))
        {
            var result = await userManager.AddToRoleAsync(
                admin,
                "Admin");

            if (!result.Succeeded)
            {
                throw new Exception(
                    "Failed to assign Admin role: " +
                    string.Join(", ",
                        result.Errors.Select(x => x.Description)));
            }
        }
    }
}