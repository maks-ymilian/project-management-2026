using System.Reflection.Metadata.Ecma335;

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
    public async Task<IActionResult> GetAll()
    {
        var listings = await _context.Listings.ToListAsync();
        if (listings == null)
            return BadRequest();

        return Ok(listings);
    }

    [HttpGet("recommended")]
    public async Task<IActionResult> GetRecommendedListings(string customerLocation)
    {
        var listings = await _context.Listings.ToListAsync();

        var recommended = listings
            .Where(l => l.CarLocation.ToLower() == customerLocation.ToLower())
            .ToList();

        return Ok(recommended);
    }

    //search api call
    // GET /api/Listing/search?query=apartment
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        // returns nothing 
        if (string.IsNullOrWhiteSpace(query))
            return Ok(new List<Listing>());

        var listings = await _context.Listings.Where(listing => listing.CarName.Contains(query.ToLower())).ToListAsync();
        return Ok(listings.Select(listing => new
        {
            Id = listing.Id,
            userId = listing.UserId,
            carName = listing.CarName,
            description = listing.Description,
            price = listing.Price,
            startDate = listing.StartDate,
            endDate = listing.EndDate,
            images = GetListingImageURLs(listing.Id),
        }));
    }

    //post for making a listing 
    [HttpPost]
    public async Task<IActionResult> CreateListing(CreateListingDTO dto)
    {
        var listing = new Listing
        {
            UserId = dto.UserId,
            CarName = dto.CarName,
            Description = dto.Description,
            Price = dto.Price,
            Year = dto.Year,
            CarLocation = dto.CarLocation,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            IsAvailable = true
        };
        _context.Listings.Add(listing);
        await _context.SaveChangesAsync();

        int i = 0;
        foreach (string url in dto.Images)
        {
            var image = new Image
            {
                ListingId = listing.Id,
                URL = url,
                Index = i,
            };
            _context.Images.Add(image);
            await _context.SaveChangesAsync();
            ++i;
        }

        return Ok(listing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteListing(int id)
    {
        var listing = await _context.Listings.FindAsync(id);
        if (listing == null)
            return NotFound();

        _context.Images.RemoveRange(GetListingImages(listing.Id));

        _context.Listings.Remove(listing);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetListing(int id)
    {
        var listing = await _context.Listings.FindAsync(id);

        if (listing == null)
            return NotFound();

        var reviews = await _context.Reviews
            .Where(r => r.ListingId == id)
            .Select(r => r.Rating)
            .ToListAsync();
        var averageRating = reviews.Count == 0 ? -1 : reviews.Average();

        return Ok(new
        {
            userId = listing.UserId,
            carName = listing.CarName,
            description = listing.Description,
            pricePerDay = listing.Price,
            availableStartDate = listing.StartDate,
            availableEndDate = listing.EndDate,
            images = GetListingImageURLs(listing.Id),
            review = averageRating,
        });
    }

    private List<Image> GetListingImages(int listing_id)
    { 
        return _context.Images.Where(image => image.ListingId == listing_id).OrderBy(image => image.Index).ToList();
    }

    private List<string> GetListingImageURLs(int listing_id)
    {
        var images = GetListingImages(listing_id);

        var image_urls = new List<string>();
        foreach (var image in images)
            image_urls.Add(image.URL);

        return image_urls;
    }
}