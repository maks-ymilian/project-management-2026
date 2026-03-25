using Xunit;
using JCK.Models;
using Microsoft.VisualBasic;

namespace Tests
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            var listing = new Listing
            {
                Id = 1,
                CarName = "Toyota Corolla",
                Price = 15000.50m,
                Year = 2020,
                Review = 5,
                CarLocation = "New York",
                IsAvailable = false,
                ImageUrl = "http://image.com/car.jpg",
                OwnerId = "owner123",
                RenterId = "renter456",
                CustomerLocation = "Los Angeles"
            };

            Assert.Equal(1, listing.Id);
            Assert.Equal("Toyota Corolla", listing.CarName);
            Assert.Equal(15000.50m, listing.Price);
            Assert.Equal(2020, listing.Year);
            Assert.Equal(5, listing.Review);
            Assert.Equal("New York", listing.CarLocation);
            Assert.False(listing.IsAvailable);
            Assert.Equal("http://image.com/car.jpg", listing.ImageUrl);
            Assert.Equal("owner123", listing.OwnerId);
            Assert.Equal("renter456", listing.RenterId);
            Assert.Equal("Los Angeles", listing.CustomerLocation);
        }
    }
}
