using System.Text.Json.Serialization;
using EmployeeManagement.Extensions;
using EmployeeManagement.Hubs;
using EmployeeManagement.Middleware;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabase(
    builder.Configuration);
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.Services.AddSignalR();

builder.Services.AddIdentityConfiguration();

builder.Services.AddJwtAuthentication(
    builder.Configuration);

builder.Services.AddAutoMapperConfiguration();

builder.Services.AddApplicationServices();

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });
builder.Services.AddSwaggerConfiguration();

builder.Services.AddControllers();

var app = builder.Build();
app.MapHub<NotificationHub>(
    "/hubs/notifications");
await app.SeedIdentity();
app.UseCors("Frontend");
app.UseSwaggerConfiguration();

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();