export function get_location(callback) {
    const location = sessionStorage.getItem("location");
    if (location) {
        callback(location);
        return;
    }

    if (!navigator.geolocation)
        return;

    navigator.geolocation.getCurrentPosition((position) => {
        fetch(`https://api.tomtom.com/search/2/reverseGeocode/${position.coords.latitude},${position.coords.longitude}.json?key=6YBNUuGNfg3XDVzZ96l62pEKJUGlJk34&radius=100`)
            .then((response) => {
                if (!response.ok)
                    throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                const location_name = data?.addresses?.[0]?.address?.municipality;
                if (location_name) {
                    sessionStorage.setItem("location", location_name);
                    callback(location_name);
                }
            })
            .catch((error) => console.error("Error fetching reverse geocode:", error));
    });
}
