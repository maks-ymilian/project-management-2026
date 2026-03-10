using Microsoft.EntityFrameworkCore;
using JCK.Models;

namespace JCK.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    /*
     * each DbSet creates a table in mysql
     * every time you change the schema here in c#, run these commands in JCK folder to update the tables in mysql:

     * dotnet ef migrations add <can be any name>
     * dotnet ef database update
    */ 
    public DbSet<Listing> Listings { get; set; }
}