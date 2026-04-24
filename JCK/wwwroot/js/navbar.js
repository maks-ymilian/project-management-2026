import { get_location } from './location.js'

const sidebar_overlay = document.getElementById("sidebar");   
sidebar_overlay.style = "position: fixed; width: 9999px; height: 9999px; z-index: 9998; transition: background-color 0.4s ease";
sidebar_overlay.classList.add("passthrough");
sidebar_overlay.innerHTML = `
    <div style="border-radius: 0" class="card sidebar" id="actual-sidebar">
        <div><image id="close-sidebar-button" src="/images/menu.svg" style="width: 40px; height: 40px; cursor: pointer"/></div>
        <a href="/" style="font-size: 16px"><p>Home</p></a>
        <a href="/create-listing" style="font-size: 16px"><p>Create a listing</p></a>
        <a href="/booking-history" style="font-size: 16px"><p>Booking history</p></a>
        <a href="/my-listings" style="font-size: 16px"><p>My listings</p></a>
    </div>
`;
const sidebar = document.getElementById("actual-sidebar");   

const navbar = document.getElementById("navbar");   
navbar.classList.add("header-bar");
navbar.innerHTML = `
    <image id="open-sidebar-button" src="/images/menu.svg" style="width: 40px; height: 40px; cursor: pointer"/>
   <div class="searchBar">
    <input type="text" id="searchBox" placeholder="Search cars..." />
    <div style="width:1px; height:24px; background:rgba(0,0,0,0.12); flex-shrink:0;"></div>
    <gmpx-place-picker id="navbar-location-search" placeholder="Search location"></gmpx-place-picker>
</div>
    <div id="user-button" style="width: 40px; height: 40px; margin-left: auto; justify-content: center; transform: scale(1.2)"></div>
`;

const searchBox = document.getElementById("searchBox");   
const open_sidebar_button = document.getElementById("open-sidebar-button");   
const close_sidebar_button = document.getElementById("close-sidebar-button");   

function open_sidebar() {
    sidebar.classList.add("sidebar-animation");
    sidebar.classList.add("sidebar-shown");
    sidebar_overlay.classList.remove("passthrough");
    sidebar_overlay.classList.add("overlay");
}

function close_sidebar() {
    sidebar.classList.remove("sidebar-shown");
    sidebar_overlay.classList.add("passthrough");
    sidebar_overlay.classList.remove("overlay");
}

sidebar_overlay.addEventListener("click", () => close_sidebar());
sidebar.addEventListener("click", (event) => event.stopPropagation());
open_sidebar_button.addEventListener("click", () => open_sidebar());
close_sidebar_button.addEventListener("click", () => close_sidebar());

get_location((location) => searchBox.placeholder = "Search in " + location);

searchBox.addEventListener("keyup", (event) => {
    if (event.key !== "Enter") return;
    doSearch();
});


// Wait for the component to upgrade and render
customElements.whenDefined('gmpx-place-picker').then(() => {
    const picker = document.getElementById('navbar-location-search');
    
    // ── strip default styles ──────────────────────────────────────────
    const stripStyles = () => {
        if (!picker.shadowRoot) return;
        const style = document.createElement('style');
        style.textContent = `
    :host {
        display: flex !important;
        align-items: center !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        height: 48px !important;
        flex: 1 !important;
    }
    input, [role="combobox"], .input-container, div[class] {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        outline: none !important;
        padding: 0 14px !important;
        font-size: 14px !important;
        color: #222 !important;
        height: 48px !important;
        line-height: 48px !important;
        width: 100% !important;
        display: flex !important;
        align-items: center !important;
    }
    .icon, [class*="icon"] {
        display: none !important;
    }
`;
        picker.shadowRoot.appendChild(style);
    };
    stripStyles();
    setTimeout(stripStyles, 100);

    // ── location listener ─────────────────────────────────────────────
  picker.addEventListener('gmpx-placechange', async (event) => {
        const place = event.target.value;
        if (!place) return;

        await place.fetchFields({ fields: ["location", "formattedAddress"] });
        const loc = place.location;
        if (!loc) return;

        const lat = typeof loc.lat === "function" ? loc.lat() : Number(loc.lat);
        const lng = typeof loc.lng === "function" ? loc.lng() : Number(loc.lng);

        window._pickedLocation = { lat, lng, address: place.formattedAddress ?? "" };

        // trigger search immediately on dropdown select
        doSearch();
    });

    // also listen for Enter inside the picker's shadow input
    setTimeout(() => {
        const shadowInput = picker.shadowRoot?.querySelector('input');
        if (shadowInput) {
            shadowInput.addEventListener('keydown', async (event) => {
                if (event.key !== "Enter") return;
                const locationText = shadowInput.value.trim();
                if (!locationText) return;

                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: locationText }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        const lat = results[0].geometry.location.lat();
                        const lng = results[0].geometry.location.lng();
                        window._pickedLocation = { lat, lng, address: locationText };
                    }
                    doSearch();
                });
            });
        }
    }, 200);
});

function doSearch() {
    const loc = window._pickedLocation;
    const query = searchBox.value.trim();
    if (loc) {
        window.location.href = `/?search=${query}&lat=${loc.lat}&lng=${loc.lng}&radiusKm=20`;
    } else {
        window.location.href = `/?search=${query}`;
    }
}