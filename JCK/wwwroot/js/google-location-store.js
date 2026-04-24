let selectedLocation = null;

export function setLocation(location) {
    selectedLocation = location;
}

export function getLocation() {
        console.log("debug : " + selectedLocation)

    return selectedLocation;
}