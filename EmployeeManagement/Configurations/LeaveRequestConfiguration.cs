using EmployeeManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EmployeeManagement.Configurations;

public class LeaveRequestConfiguration
    : IEntityTypeConfiguration<LeaveRequest>
{
    public void Configure(
        EntityTypeBuilder<LeaveRequest> entity)
    {
        entity.HasQueryFilter(x => !x.IsDeleted);
        entity.Property(x => x.StartDate).HasColumnType("date");
        entity.Property(x => x.EndDate).HasColumnType("date");
    }
}