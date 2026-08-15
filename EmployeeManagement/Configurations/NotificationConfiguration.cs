using EmployeeManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EmployeeManagement.Configurations;

public class NotificationConfiguration
    : IEntityTypeConfiguration<Notification>
{
    public void Configure(
        EntityTypeBuilder<Notification> entity)
    {
        entity
      .HasOne(x => x.User)
      .WithMany()
      .HasForeignKey(x => x.UserId)
      .OnDelete(DeleteBehavior.Cascade);

        entity
            .HasIndex(x => new
            {
                x.UserId,
                x.IsRead,
                x.CreatedAt
            });
    }
}