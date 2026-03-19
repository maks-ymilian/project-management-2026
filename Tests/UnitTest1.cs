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
                CarName = "Toyota"
            };

            Assert.Equal(1, listing.Id);
            Assert.Equal("Toyota", listing.CarName);
        }
    }
}
