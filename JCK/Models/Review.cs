namespace JCK.Models;

public class Review
{
    public int Id{ get; set; }

    public int ListingId{ get; set; }

    [Range(1,5)]
    public int Rating { get; set; }

    [Required]
    [StringLength(2000)]
    public string Text { get; set; } = string.Empty;


    public DateTime CreatedAt{ get; set; } = DateTime.UtcNow;

    [StringLength(200)]
    public string ReviewerName { get; set; } = "Anonymous";

    [StringLength(500)]
    public string ReviewerProfileImage { get; set; } = "/images/user.jpg";
 }