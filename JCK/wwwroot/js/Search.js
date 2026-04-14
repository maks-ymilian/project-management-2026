import { get_location } from '/js/location.js'

const searchBox = document.getElementById("searchBox");   

get_location((location) => searchBox.placeholder = "Search in " + location);

searchBox.addEventListener("keyup", (event) => {
    if (event.key !== "Enter")
        return;

    window.location.href = `/?search=${searchBox.value.trim()}`;
});

