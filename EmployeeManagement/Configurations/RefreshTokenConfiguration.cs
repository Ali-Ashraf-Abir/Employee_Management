using EmployeeManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EmployeeManagement.Configurations;

public class RefreshTokenConfiguration
    : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(
        EntityTypeBuilder<RefreshToken> entity)
    {
        entity
    .HasOne(x => x.User)
    .WithMany()
    .HasForeignKey(x => x.UserId)
    .OnDelete(DeleteBehavior.Cascade);

        entity
            .HasIndex(x => x.TokenHash)
            .IsUnique();
    }
}