namespace JCK.Models;

public class Listing
{
    //Car info
    public int Id { get; set; }
    public string CarName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Year { get; set; }

    public int Review{ get; set; }

    // Location
    public string CarLocation { get; set; } = string.Empty;

    // Availability
    public bool IsAvailable { get; set; } = true;

    //Image
    public string ImageUrl { get; set; } = string.Empty;

    //Car Owner
    public string OwnerId { get; set; } = string.Empty;

    //Customer
    public string RenterId { get; set; }
    public string CustomerLocation { get; set; } = string.Empty;
    

    
}