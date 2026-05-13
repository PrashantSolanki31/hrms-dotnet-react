using DockerApp.Data;
using DockerApp.DataSeeder;
using DockerApp.Extensions;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ---------------- LOGGING ----------------
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// ---------------- SERVICES ----------------
builder.Services.AddAppServices(builder.Configuration);

var app = builder.Build();

// ---------------- PIPELINE ----------------
app.UseCors("AllowFrontend");

app.UseSerilogRequestLogging();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ---------------- DB MIGRATION + SEED ----------------
using (var scope = app.Services.CreateScope())
//{
//    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

//    db.Database.Migrate();
//    DbSeeder.Seed(db);
//}

app.Run();