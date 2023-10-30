//IIFE (Immediately Invoked Function Expression)
(() => {
    //Create a Leaflet map and set its initial view
    let map = L.map('theMap').setView([44.650627, -63.597140], 14);

    //Add a tile layer from OpenStreetMap with attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Create a custom icon for markers
    let customIcon = L.icon({
        iconUrl: './bus.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });


    //Function to create a GeoJSON object from filtered data
    function geoJSONFromData(data) {
        return {
            type: "FeatureCollection",
            features: data.map((bus) => ({
                type: "Feature",
                properties: { //extracting the bearing, routeId, and directionId
                    bearing: bus.vehicle.position.bearing,
                    route: bus.vehicle.trip.routeId,
                    direction: bus.vehicle.trip.directionId,
                    busLabel: bus.id
                },
                //Location of the bus
                geometry: {
                    type: "Point",
                    coordinates: [ //extracting the longitude and latitude from data
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
            //Define how point feature will be displayed as markers
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    //Set icon to customIcon
                    icon: customIcon,
                    //Rotate the marker based on the bearing property
                    rotationAngle: feature.properties.bearing,
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                    `Route: ${feature.properties.route}<br>Bus label: #${feature.properties.busLabel}`
                );
            },
        }).addTo(map);
    }

    //Function to refresh the map data
    function refreshMap() {
        // Clear existing map data
        map.eachLayer(function (layer) {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer); //Remove the GeoJSON layer from the map
            }
        });

        //Fetch and process updated bus data
        fetch("https://prog2700.onrender.com/hrmbuses")
            .then((response) => response.json())
            .then((data) => {
                //filter data for buses on routes 1-10
                const filteredData = data.entity.filter(
                    (bus) =>
                        bus.vehicle.trip.routeId >= 1 && bus.vehicle.trip.routeId <= 10
                );

                //Convert the filtered data to a GeoJSON object
                const geoJSON = geoJSONFromData(filteredData);

                //update the map with custom markers
                updateMapWithCustomMarkers(geoJSON);
                console.log(data)
            })
            .catch((error) => {
                console.error("Error fetching and processing data:", error);
            });

    }


    //interval refresh 15 seconds
    setInterval(refreshMap, 15000);

    refreshMap();
})();
