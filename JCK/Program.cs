var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// serve files from wwwroot folder
app.UseDefaultFiles(); // serves index.html by default
app.UseStaticFiles();

// example api endpoint
app.MapGet("/api/test", () => "hello from server");

app.Run();
