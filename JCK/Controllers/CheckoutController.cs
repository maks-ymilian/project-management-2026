using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
[ApiController]
[Route("api/checkout")]
public class CheckoutController : ControllerBase
{
    [HttpPost]
    public IActionResult Create()
    {
        var domain = "http://localhost:5130";

        var options = new SessionCreateOptions
        {
            Mode = "payment",
            SuccessUrl = domain + "/success.html",
            CancelUrl = domain + "/cancel.html",
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "eur",
                        UnitAmount = 2000, // €20
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Car Rental"
                        }
                    },
                    Quantity = 1
                }
            }
        };

        try
        {
            var service = new SessionService();
            var session = service.Create(options);


            return Ok(new { url = session.Url });
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERROR: " + ex.Message);
            return BadRequest(ex.Message);
        }
    }
}