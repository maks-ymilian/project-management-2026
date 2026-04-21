using System.ComponentModel.DataAnnotations;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    public record CreateReviewRequest(
        int ListingId,
        int Rating,
        string Text,
        string userId
    );

    [HttpGet]
    public async Task<IActionResult> GetByListing([FromQuery] int listingId)
    {
        if (listingId <= 0)
            return BadRequest("Invalid listingId.");

        var reviews = await _context.Reviews
            .Where(r => r.ListingId == listingId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                id = r.Id,
                listingId = r.ListingId,
                rating = r.Rating,
                createdAt = r.CreatedAt,
                userId = r.UserId,
                text = r.Text
            })
            .ToListAsync();

        var averageRating = reviews.Count == 0
            ? -1
            : reviews.Average(r => r.rating);

        return Ok(new
        {
            averageRating = Math.Round(averageRating, 2),
            reviews
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewRequest request)
    {
        if (request.ListingId <= 0)
            return BadRequest("Invalid listingId.");

        if (request.Rating < 1 || request.Rating > 5)
            return BadRequest("Rating must be between 1 and 5.");

        if (string.IsNullOrWhiteSpace(request.Text))
            return BadRequest("Review text is required.");

        if (request.Text.Length > 2000)
            return BadRequest("Review text is too long.");

        var listingExists = await _context.Listings.AnyAsync(l => l.Id == request.ListingId);
        if (!listingExists)
            return BadRequest("Listing not found.");

        var review = new Review
        {
            ListingId = request.ListingId,
            Rating = request.Rating,
            Text = request.Text.Trim(),
            UserId = request.userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            reviewId = review.Id
        });
    }
}