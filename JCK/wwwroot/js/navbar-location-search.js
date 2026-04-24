const locationPicker = document.getElementById('navbar-location-search');
console.log("INIT. locationPicker element found:", locationPicker); // null = wrong ID

locationPicker.addEventListener('gmpx-placechange', async (event) => {
    const place = event.target.value;

    // ── 1. Did the event fire and what came in? ──────────────────────
    console.log("1. event fired:", event);
    console.log("2. raw place:", place);

    if (!place) {
        console.warn("3. place is null/undefined — event fired but no value");
        return;
    }

    // ── 2. Before fetchFields — fields likely empty here ─────────────
    console.log("4. BEFORE fetchFields → location:", place.location);
    console.log("5. BEFORE fetchFields → address:", place.formattedAddress);

    try {
        await place.fetchFields({ fields: ["location", "formattedAddress"] });
        console.log("6. fetchFields resolved OK");
    } catch (e) {
        console.error("7. fetchFields FAILED:", e);
        return;
    }

    // ── 3. After fetchFields — these should now be populated ─────────
    console.log("8. AFTER fetchFields → location:", place.location);
    console.log("9. AFTER fetchFields → address:", place.formattedAddress);

    const loc = place.location;
    if (!loc) {
        console.warn("10. location still null after fetchFields — place has no geometry");
        return;
    }

    const lat = typeof loc.lat === "function" ? loc.lat() : Number(loc.lat);
    const lng = typeof loc.lng === "function" ? loc.lng() : Number(loc.lng);
    console.log("11. resolved lat/lng:", lat, lng); // NaN here = wrong accessor format

    const searchBox = document.getElementById('searchBox');
    console.log("12. searchBox element found:", searchBox); // null = wrong ID

    const searchTerm = searchBox?.value.trim() ?? "";
    const url = `/?search=${searchTerm}&lat=${lat}&lng=${lng}&radius=20`;
    console.log("13. navigating to:", url);
    window.location.href = url;
});

// ── Enter key in searchBox ────────────────────────────────────────────
const searchBox = document.getElementById('searchBox');
console.log("INIT. searchBox element found:", searchBox); // null = wrong ID

searchBox.addEventListener("keyup", (event) => {
    if (event.key !== "Enter") return;
    console.log("14. Enter pressed in searchBox");

    const place = locationPicker.value;
    console.log("15. locationPicker.value at keyup:", place); // is place object set?
    console.log("16. place.location at keyup:", place?.location); // was gmpx-placechange already fired?

    if (place?.location) {
        const loc = place.location;
        const lat = typeof loc.lat === "function" ? loc.lat() : Number(loc.lat);
        const lng = typeof loc.lng === "function" ? loc.lng() : Number(loc.lng);
        console.log("17. using cached location, lat/lng:", lat, lng);
        window.location.href = `/?search=${searchBox.value.trim()}&lat=${lat}&lng=${lng}&radius=20`;
    } else {
        console.log("18. no location on picker — did user select from dropdown or just type?");
        window.location.href = `/?search=${searchBox.value.trim()}`;
    }
});