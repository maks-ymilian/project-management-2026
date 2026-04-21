import { get_location } from './location.js'

const sidebar_overlay = document.getElementById("sidebar");   
sidebar_overlay.style = "position: fixed; width: 9999px; height: 9999px; z-index: 9998; transition: background-color 0.4s ease";
sidebar_overlay.classList.add("passthrough");
sidebar_overlay.innerHTML = `
    <div style="border-radius: 0" class="card sidebar" id="actual-sidebar">
        <div><image id="close-sidebar-button" src="/images/menu.svg" style="width: 40px; height: 40px; cursor: pointer"/></div>
        <a href="/" style="font-size: 16px"><p>Home</p></a>
        <a href="/create-listing" style="font-size: 16px"><p>Create a listing</p></a>
        <a href="//booking-history/index.html" style="font-size: 16px"><p>Booking history</p></a>
        <a href="/" style="font-size: 16px"><p>My listings</p></a>
    </div>
`;
const sidebar = document.getElementById("actual-sidebar");   

const navbar = document.getElementById("navbar");   
navbar.classList.add("header-bar");
navbar.innerHTML = `
    <image id="open-sidebar-button" src="/images/menu.svg" style="width: 40px; height: 40px; cursor: pointer"/>
    <div class="searchBar"><input type="text" id="searchBox" placeholder="Search Near you" /></div>
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
    if (event.key !== "Enter")
        return;

    window.location.href = `/?search=${searchBox.value.trim()}`;
});

