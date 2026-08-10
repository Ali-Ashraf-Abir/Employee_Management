using EmployeeManagement.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabase(
    builder.Configuration);

builder.Services.AddIdentityConfiguration();

builder.Services.AddJwtAuthentication(
    builder.Configuration);

builder.Services.AddAutoMapperConfiguration();

builder.Services.AddApplicationServices();

builder.Services.AddSwaggerConfiguration();

builder.Services.AddControllers();

var app = builder.Build();

await app.SeedIdentity();

app.UseSwaggerConfiguration();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();