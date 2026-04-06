
global using Microsoft.AspNetCore.Mvc;                  // ControllerBase, ApiController, IActionResult
global using Microsoft.EntityFrameworkCore;            // DbContext, DbSet<>, ToListAsync(), EF Core features
global using System.Threading.Tasks;                   // async/await, Task<>
global using System.Collections.Generic;               // List<>, IEnumerable<>
global using System;                                   // basic types
global using System.ComponentModel.DataAnnotations;   // [Required], [Key], [StringLength], etc.
global using JCK.Data;                                   // AppDbContext / DbContext
global using JCK.Models;                                // Listing, Product, other model classes
global using Microsoft.Extensions.DependencyInjection; // builder.Services.AddXYZ()
global using Microsoft.Extensions.Hosting;            // app.Lifetime, IHost
global using Microsoft.AspNetCore.Builder;            // app.UseXYZ(), WebApplication
global using System.Linq;                              // LINQ operations
global using System.Text.Json;                         // JsonSerializer if needed
global using System.Text.Json.Serialization;           // JsonPropertyName etc.
global using System.ComponentModel.DataAnnotations.Schema;