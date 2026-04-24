namespace JCK.Models;

public class Listing
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string CarName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Year { get; set; }
    public string CarLocation { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    //map
    public double Latitude {get; set;}
    public double Longitude {get; set;}
    public string Address {get; set;} = string.Empty;

    public bool IsAvailable { get; set; } = true;
}