
using System.Formats.Asn1;

[ApiController]
[Route("api/[controller]")]
public class ListingController : ControllerBase // inherits from controller base 

{
    
    private readonly AppDbContext _context;

     public ListingController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("id")]
    public async Task<IActionResult> GetProducts() 
    {
        var products = await _context.Listings.ToListAsync();
        
        if (products == null)
            return BadRequest();
        
        return Ok(products); // Returns JSON
    }


    //search api call
     // GET /api/Listing/search?query=apartment
    [HttpGet("search")]
    public async Task<IActionResult>Search([FromQuery] string query)
    {
        // returns nothing 
        if (string.IsNullOrWhiteSpace(query))
            return Ok(new List<Listing>());

        var results = _context.Listings.Where(listing => listing.CarName.ToLower().Contains(query.ToLower())).Select(listing => new
        {
            listing.CarName
        }
        ).ToListAsync();

        return Ok(results);
    }  
             
    [HttpPost]
    public async Task<IActionResult> CreateListing(Listing listing)
    {
        _context.Listings.Add(listing);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProducts), new { id = listing.Id }, listing);
    }


    [HttpDelete("{id}")]
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