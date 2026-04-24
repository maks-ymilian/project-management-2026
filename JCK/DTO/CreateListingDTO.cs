using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JCK.DTO
{
    public class CreateListingDTO
    {
        public string UserId { get; set; } = string.Empty;
        public string CarName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Year { get; set; }
        public string CarLocation { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }

        public double Latitude {get; set;}
        public double Longitude {get; set;}
        public string Address {get; set;} = string.Empty;

        public List<string> Images { get; set; } = [];
    }
}