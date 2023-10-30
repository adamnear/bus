// IIFE (Immediately Invoked Function Expression)
(() => {
    // Create a Leaflet map and set its initial view
    let map = L.map('theMap').setView([44.650627, -63.597140], 14);

    // Add a tile layer from OpenStreetMap with attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define a custom icon for markers
    let customIcon = L.icon({
        iconUrl: './bus.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });

    // Function to create a GeoJSON object from filtered data
    function geoJSONFromData(data) {
        return {
            type: "FeatureCollection",
            features: data.map((bus) => ({
                type: "Feature",
                properties: {
                    bearing: bus.vehicle.position.bearing,
                    route: bus.vehicle.trip.routeId,
                    direction: bus.vehicle.trip.directionId,
                },
                geometry: {
                    type: "Point",
                    coordinates: [
                        bus.vehicle.position.longitude,
                        bus.vehicle.position.latitude
                    ],
                },
            })),
        };
    }

    // Function to update the map with custom markers
    function updateMapWithCustomMarkers(geoJSON) {
        L.geoJSON(geoJSON, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: customIcon,
                    rotationAngle: feature.properties.bearing,
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                    `Route: ${feature.properties.route}<br>Direction: ${feature.properties.direction}`
                );
            },
        }).addTo(map);
    }

    // Function to refresh the map data
    function refreshMap() {
        // Clear existing map data
        map.eachLayer(function (layer) {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });

        // Fetch and process updated bus data
        fetch("https://prog2700.onrender.com/hrmbuses")
            .then((response) => response.json())
            .then((data) => {
                // Filter data for buses on routes 1-10
                const filteredData = data.entity.filter(
                    (bus) =>
                        bus.vehicle.trip.routeId >= 1 && bus.vehicle.trip.routeId <= 10
                );
                const geoJSON = geoJSONFromData(filteredData);

                // Update the map with custom markers
                updateMapWithCustomMarkers(geoJSON);
            })
            .catch((error) => {
                console.error("Error fetching and processing data:", error);
            });
    }

    // Set an interval to refresh the map every 3 seconds (3000 milliseconds)
    setInterval(refreshMap, 3000);

    // Initial map data refresh
    refreshMap();
})();
