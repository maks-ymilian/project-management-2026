

[ApiController]
[Route("api/[controller]")]
public class ListingController : ControllerBase // inherits from controller base 

{
    
    private readonly AppDbContext _context;

     public ListingController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _context.Listings.ToListAsync();
        return Ok(products); // Returns JSON
    }


    [HttpPost]
    public async Task<IActionResult> CreateListing(Listing listing)
    {
        _context.Listings.Add(listing);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProducts), new { id = listing.Id }, listing);
    }


    [HttpDelete]
    public async Task<IActionResult> DeleteListing(int id)
    {
        var listing = await _context.Listings.FindAsync(id);

        if (listing == null)
            return NotFound();

        _context.Listings.Remove(listing);
        await _context.SaveChangesAsync();

        return NoContent();
    }


}