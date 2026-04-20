namespace JCK.Models;

public class Booking
{
    public int Id { get; set; }
    public int ListingId { get; set; }
    public string? UserId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public bool Confirmed { get; set; } = false; // the booking is added once the user opens the stripe session, then when the payment is confirmed, this is set to true
}