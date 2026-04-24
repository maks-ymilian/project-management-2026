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
public async Task<IActionResult> Search(
    [FromQuery] string? query,
    [FromQuery] double? lat,
    [FromQuery] double? lng,
    [FromQuery] double radiusKm = 20)
{
    // Start with all listings
    var listings = await _context.Listings.ToListAsync();

    // Filter by name only if query is provided
    if (!string.IsNullOrWhiteSpace(query))
    {
        listings = listings
            .Where(l => l.CarName.ToLower().Contains(query.ToLower()))
            .ToList();
    }

    // Filter by radius if lat/lng provided
    if (lat.HasValue && lng.HasValue)
    {
        listings = listings
            .Where(l => Haversine(lat.Value, lng.Value, l.Latitude, l.Longitude) <= radiusKm)
            .ToList();
    }

    return Ok(listings.Select(listing => new
    {
        id = listing.Id,
        userId = listing.UserId,
        carName = listing.CarName,
        description = listing.Description,
        price = listing.Price,
        startDate = listing.StartDate,
        endDate = listing.EndDate,
        images = GetListingImageURLs(listing.Id),
    }));
}

private static double Haversine(double lat1, double lng1, double lat2, double lng2)
{
    const double R = 6371; // Earth radius in km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
            Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
            Math.Sin(dLng / 2) * Math.Sin(dLng / 2);
    return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
}

    [HttpGet("user")]
    public async Task<IActionResult> GetUserListings([FromQuery] string userId)
    {
        var listings = await _context.Listings.Where(x => x.UserId == userId).ToListAsync();
        return Ok(listings);
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

            Address = dto.Address,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
          

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