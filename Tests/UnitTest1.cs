using Xunit;
using JCK.Models;
using System;

namespace Tests
{
    public class UnitTest1
    {
        [Fact]
        public void Listing_Should_Create_Correctly()
        {
            var listing = new Listing
            {
                Id = 1,
                CarName = "Toyota Corolla",
                Description = "Reliable car",
                Price = 15000.50m,
                Year = 2020,
                CarLocation = "New York",
                StartDate = new DateOnly(2025, 1, 1),
                EndDate = new DateOnly(2025, 1, 10),
                IsAvailable = true
            };

            Assert.Equal(1, listing.Id);
            Assert.Equal("Toyota Corolla", listing.CarName);
            Assert.Equal("Reliable car", listing.Description);
            Assert.Equal(15000.50m, listing.Price);
            Assert.Equal(2020, listing.Year);
            Assert.Equal("New York", listing.CarLocation);
            Assert.True(listing.IsAvailable);
        }
    }
}
