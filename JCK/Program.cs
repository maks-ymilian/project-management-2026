using Microsoft.EntityFrameworkCore;
using JCK.Data;

var builder = WebApplication.CreateBuilder(args);

// register the AppDbContext which holds the tables
var connectionString = Environment.GetEnvironmentVariable("SUPABASE_CONNECTION_STRING");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));
Console.WriteLine("Connection string: " + connectionString);

builder.Services.AddControllers(); // <-- Required

var app = builder.Build();


// serve files from wwwroot folder
app.UseDefaultFiles(); // serves index.html by default
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.MapControllers(); // <-- Required for [ApiController] routes


app.Run();
