using Microsoft.EntityFrameworkCore;
using JCK.Data;

var builder = WebApplication.CreateBuilder(args);

// register the AppDbContext which holds the tables
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection"); // gets the string from the file appsettings.Development.json, the password in this file needs to be the same as the root password in mysql
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

var app = builder.Build();

// serve files from wwwroot folder
app.UseDefaultFiles(); // serves index.html by default
app.UseStaticFiles();

// example api endpoint remove this
app.MapGet("/api/test", () => "hello from server");

app.Run();
