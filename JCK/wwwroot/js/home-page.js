import { get_location } from './location.js'
import { format_date_range } from './common.js'

async function fetchListings(query) {
    try {
        let response;
        if (query)
            response = await fetch(`/api/listing/search?query=${encodeURIComponent(query)}`);
        else
            response = await fetch("/api/Listing");

        if (!response.ok) throw new Error(`${response.status}`);
        return await response.json();
    } catch (err) {
        console.error('Error fetching listings:', err);
    }
}

const listing_container = document.getElementById("listing-container");
const title = document.getElementById("title");

const cardStates = {};
const likedSet = new Set();

window.slideCard = function(id, dir, e) {
    e.stopPropagation();
    const slidesEl = document.getElementById('slides-' + id);
    const total = slidesEl.children.length;
    cardStates[id] = (cardStates[id] + dir + total) % total;
    slidesEl.style.transform = `translateX(-${cardStates[id] * 100}%)`;
    document.querySelectorAll(`#dots-${id} .dot`).forEach((d, j) =>
        d.classList.toggle('active', j === cardStates[id])
    );
};

window.toggleHeart = function(id, e) {
    e.stopPropagation();
    likedSet.has(id) ? likedSet.delete(id) : likedSet.add(id);
    document.getElementById('heart-' + id).classList.toggle('liked', likedSet.has(id));
};

function createCard(item, images, average_rating) {
    cardStates[item.id] = 0;

    const slides = images.length > 0
        ? images.map(url => `<div class="slide"><img src="${url}" alt="" /></div>`).join('')
        : `<div class="slide" style="background:#e0e0e0; width:100%; height:100%;"></div>`;

    const dots = images.length > 1
        ? images.map((_, j) => `<div class="dot${j === 0 ? ' active' : ''}"></div>`).join('')
        : '';

    const navBtns = images.length > 1 ? `
        <button class="nav-btn prev" onclick="slideCard('${item.id}',-1,event)">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#222" stroke-width="2.5"><polyline points="8,2 4,6 8,10"/></svg>
        </button>
        <button class="nav-btn next" onclick="slideCard('${item.id}',1,event)">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#222" stroke-width="2.5"><polyline points="4,2 8,6 4,10"/></svg>
        </button>
        <div class="dots" id="dots-${item.id}">${dots}</div>
    ` : '';

    return `
        <a href="listing?id=${item.id}" style="text-decoration:none; color:inherit;">
            <div class="listing-card">
                <div class="img-wrap">
                    <div class="slides" id="slides-${item.id}">${slides}</div>
                    ${navBtns}
                    <button class="heart-btn" id="heart-${item.id}" onclick="toggleHeart('${item.id}',event)">
                        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                </div>
                <div class="card-info">
                    <div class="card-row">
                        <span class="card-title">${item.carName}</span>
                        ${average_rating === -1 ? "" : `
                            <span class="card-rating" style="font: inherit; font-size: 14px; margin-right: 5px">
                                <svg width="14" height="14" viewBox="0 0 12 12" fill="#222"><path d="M6 1l1.4 2.8 3.1.4-2.25 2.2.53 3.1L6 8l-2.78 1.5.53-3.1L1.5 4.2l3.1-.4z"/></svg>
                                ${average_rating.toFixed(2)}
                            </span>
                        `}
                    </div>
                    <div class="card-sub">${format_date_range(item.startDate, item.endDate, true)}</div>
                    <div class="card-price"><strong>&euro;${item.price}</strong> / day</div>
                </div>
            </div>
        </a>
    `;
}

const params = new URLSearchParams(window.location.search);
const listings = await fetchListings(params.get("search"));

listings.forEach(async item => {
    const response = await fetch(`/api/Listing/${item.id}`);
    if (!response.ok) console.log(`couldn't get listing info: ${response.status}`);
    const json = await response.json();
    const images = json.images ?? [];
    const average_rating = json.review;

    listing_container.insertAdjacentHTML("beforeend", createCard(item, images, average_rating));
});

get_location((location) => {
    title.innerHTML = "Cars in " + location;
});