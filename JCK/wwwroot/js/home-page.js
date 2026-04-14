const apiUrl = '/api/Listing'; 

//fetch listing general 
export async function fetchListings() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`${response.status}`);
        return await response.json();

    } catch (err) {
        console.error('Error fetching listings:', err);
    }
}

const listing_container = document.getElementById("listing-container");
const title = document.getElementById("title");

const listings = await fetchListings();
listings.forEach(item => {
    listing_container.insertAdjacentHTML("beforeend", `
        <a href="${"/listing"}">
            <div class="card" style="padding: 16px; gap: 7px; display: flex; flex-direction: column">
                <img src="${item.imageUrl}" style="width: 100%; aspect-ratio: 1 / 1; border-radius: 16px">
                <p style="margin: 0px; font-size: 16px">${item.carName}</p>
                <p style="margin: 0px; font-size: 14px; color: #676767">${"22 - 24 May"}<br/>&euro;${item.price} &middot; <svg style="height: 10px; width: 10px; fill: #676767"><use href="#star"></use></svg> ${item.review}</p>
            </div>
        </a>
    `);
});

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        fetch(`https://api.tomtom.com/search/2/reverseGeocode/${position.coords.latitude},${position.coords.longitude}.json?key=6YBNUuGNfg3XDVzZ96l62pEKJUGlJk34&radius=100`)
            .then((response) => {
                if (!response.ok)
                    throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                title.innerHTML = "Cars in " + data.addresses[0].address.municipality;
            })
            .catch((error) => console.error("Error fetching reverse geocode:", error));
    });
} 

