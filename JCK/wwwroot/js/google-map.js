import { setLocation } from './google-location-store.js';

const map = document.getElementById("map");
const marker = document.getElementById("marker");
const placePicker = document.getElementById("place-picker");

placePicker.addEventListener("gmpx-placechange", async (event) => {
    const place = event.target.value;

    console.log("raw place object:", place);           // see everything
    console.log("place.location:", place?.location);   // is it there?
    console.log("place.formattedAddress:", place?.formattedAddress);

    if (!place) return;

    // fetchFields forces the API to populate location + formattedAddress
    // without this, they can come back undefined even on a valid pick
    try {
        await place.fetchFields({ fields: ["location", "formattedAddress"] });
    } catch (e) {
        console.error("fetchFields failed:", e);
        return;
    }

    const loc = place.location;
    if (!loc) {
        console.warn("still no location after fetchFields");
        return;
    }

    const lat = typeof loc.lat === "function" ? loc.lat() : Number(loc.lat);
    const lng = typeof loc.lng === "function" ? loc.lng() : Number(loc.lng);
    const address = place.formattedAddress ?? "";

    console.log("storing location:", { lat, lng, address });

    map.center = { lat, lng };
    map.zoom = 17;
    marker.position = { lat, lng };

    setLocation({ lat, lng, address });

    const input = document.getElementById("location-input");
    if (input) input.value = address;
});