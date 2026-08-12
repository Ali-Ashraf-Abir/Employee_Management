using EmployeeManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EmployeeManagement.Configurations;

public class AttendanceRecordConfiguration
    : IEntityTypeConfiguration<AttendanceRecord>
{
    public void Configure(
        EntityTypeBuilder<AttendanceRecord> entity)
    {
        entity.HasIndex(x => new { x.EmployeeId, x.EnteredAt });
        entity.HasIndex(x => x.EnteredAt);
        entity.HasIndex(x => x.EmployeeId).IsUnique().HasFilter("\"LeftAt\" IS NULL");

    }
}