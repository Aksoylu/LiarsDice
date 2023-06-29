using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

JwtHelper jwtHelper = new JwtHelper(configuration);

/* Create In-memory database helper */
DatabaseHelper databaseHelper = new DatabaseHelper();

builder.Services.AddSingleton<JwtHelper>(jwtHelper);
builder.Services.AddSingleton<DatabaseHelper>(databaseHelper);
builder.Services.AddControllers();
builder.Services.AddSignalR();

var app = builder.Build();

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

/* Configuration for Realtime Communication */
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<RoomController>("/chat");
});

app.Run();
