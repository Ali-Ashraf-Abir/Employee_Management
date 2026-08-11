using EmployeeManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EmployeeManagement.Configurations;

public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
{
    public void Configure(EntityTypeBuilder<Employee> entity)
    {
        entity.HasKey(e => e.Id);

        entity.Property(e => e.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        entity.Property(e => e.LastName)
            .IsRequired()
            .HasMaxLength(100);

        entity.Property(e => e.Department)
            .IsRequired()
            .HasMaxLength(100);

        entity.Property(e => e.Position)
            .IsRequired()
            .HasMaxLength(100);

        entity.HasOne(e => e.User)
            .WithOne()
            .HasForeignKey<Employee>(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasIndex(e => e.UserId)
            .IsUnique();

        entity.HasIndex(x => x.EmployeeId)
        .IsUnique();
    }
}