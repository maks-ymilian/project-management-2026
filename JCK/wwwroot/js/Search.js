//orginal fetch listing function in homepage.js
import { fetchListings } from './home-page.js';

const searchBox = document.getElementById("searchBox");   
const listingList = document.getElementById("listingList");

const SearchDatabase = async (query) => {
    try{    
        const response = await fetch(`/api/listing/search?query=${encodeURIComponent(query)}`);
        const data = await response.json(); 

        listingList.innerHTML = "";

        data.forEach(listing => {
            const li = document.createElement("li");
            li.textContent = `${listing.carName} - $${listing.id}`;
            listingList.appendChild(li);
        });
    } catch (err){
        console.error(err);
    }
}


searchBox.addEventListener("input", () => {
    const query = searchBox.value.trim();
    if (query) {
        SearchDatabase(query);
    } else {
        fetchListings();
    }
});

