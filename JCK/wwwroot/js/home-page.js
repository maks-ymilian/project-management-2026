const apiUrl = '/api/Listing'; 

async function fetchListings() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`${response.status}`);
        const listings = await response.json();

        const listEl = document.getElementById('listingList');
        listEl.innerHTML = ''; // Clear existing content

        listings.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.carName} - $${item.id}`;
            listEl.appendChild(li);
        });

    } catch (err) {
        console.error('Error fetching listings:', err);
    }
}

// Fetch listings when page loads
document.addEventListener('DOMContentLoaded', fetchListings);
