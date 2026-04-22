using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Stripe.Checkout;
using Stripe;

[ApiController]
[Route("api/[controller]")]
public class CheckoutController : ControllerBase
{
    private readonly AppDbContext _context;

    public CheckoutController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetUserBooking(int listing_id, string user_id)
    { 
        Booking? booking = await _context.Bookings.FirstOrDefaultAsync(x => x.UserId == user_id && x.ListingId == listing_id);
        if (booking == null)
            return NotFound();

        return Ok(booking);
    }

    public class BookingRequest
    {
        public int listing_id { get; set; }
        public string user_id { get; set; } = "";
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BookingRequest data)
    {
        Booking? existing_booking = await _context.Bookings.FirstOrDefaultAsync(x => x.UserId == data.user_id && x.ListingId == data.listing_id);
        if (existing_booking != null && existing_booking.Confirmed)
            return StatusCode(400, "User already submitted booking");

        Listing? listing = await _context.Listings.FindAsync(data.listing_id);
        if (listing == null)
            return NotFound();

        if (data.start_date < listing.StartDate.ToDateTime(TimeOnly.MinValue)) return StatusCode(400, "Input start date is before listing start date");
        if (data.end_date > listing.EndDate.ToDateTime(TimeOnly.MinValue))     return StatusCode(400, "Input end date is after listing end date");
        if (data.start_date > data.end_date)                                   return StatusCode(400, "Start date is after end date");

        var booking = new Booking { 
            ListingId = data.listing_id,
            UserId = data.user_id,
            StartDate = DateOnly.FromDateTime(data.start_date),
            EndDate = DateOnly.FromDateTime(data.end_date),
            Confirmed = false,
        };
        if (existing_booking == null)
            _context.Bookings.Add(booking);
        else
        { 
            booking.Id = existing_booking.Id;
            _context.Entry(existing_booking).CurrentValues.SetValues(booking);
        }
        await _context.SaveChangesAsync();

        int num_days = (booking.EndDate.DayNumber - booking.StartDate.DayNumber) + 1;
        long price = (long)listing.Price * num_days * 100;

        try
        {
            string base_url = $"{Request.Scheme}://{Request.Host}";

            var service = new SessionService();
            var session = service.Create(new SessionCreateOptions {
                Mode = "payment",
                SuccessUrl = base_url + $"/listing/?id={data.listing_id}&checkout_state=success",
                CancelUrl = base_url + $"/listing/?id={data.listing_id}&checkout_state=cancel",
                Metadata = new Dictionary<string, string>{["booking_id"] = booking.Id.ToString()},
                LineItems = [
                    new SessionLineItemOptions {
                        Quantity = 1,
                        PriceData = new SessionLineItemPriceDataOptions {
                            Currency = "eur",
                            UnitAmount = price,
                            ProductData = new SessionLineItemPriceDataProductDataOptions {Name = listing.CarName},
                        },
                    },
                ],
            });

            return Ok(new { url = session.Url });
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERROR: " + ex.Message);
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("confirm")]
    public async Task<IActionResult> Confirm()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();
        var stripeSignature = Request.Headers["stripe-signature"];

        Event stripeEvent;
        try
        {
            stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, Environment.GetEnvironmentVariable("STRIPE_TEST_WEBHOOK_SECRET"));
        }
        catch (StripeException e)
        {
            return BadRequest($"verification failed: {e.Message}");
        }

        if (stripeEvent.Type != EventTypes.CheckoutSessionCompleted)
            return BadRequest("wrong event type");

        if (stripeEvent.Data.Object is not Session session)
            return BadRequest("no session");

        session.Metadata.TryGetValue("booking_id", out var booking_id_value);
        if (!int.TryParse(booking_id_value, out int booking_id))
            return BadRequest("no booking id / wrong type");

        var booking = await _context.Bookings.FirstOrDefaultAsync(x => x.Id == booking_id);
        if (booking == null)
            return BadRequest("invalid booking id");

        booking.Confirmed = true;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory(string userId)
    {
        var history = await _context.Bookings
            .Where(b => b.UserId == userId && b.Confirmed)
            .Join(_context.Listings,
                booking => booking.ListingId,
                listing => listing.Id,
                (booking, listing) => new
                {
                    BookingId = booking.Id,
                    ListingId = listing.Id,
                    StartDate = booking.StartDate,
                    EndDate = booking.EndDate,
                    Confirmed = booking.Confirmed,
                    CarName = listing.CarName,
                    Price = listing.Price
                })
            .ToListAsync();

        return Ok(history);
    }
}

