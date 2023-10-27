// IIFE
(() => {


    //create map in leaflet and tie it to the div called 'theMap'
    let map = L.map('theMap').setView([44.650627, -63.597140], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Fetch live bus data
    function fetchTransitData() {
        fetch('https://prog2700.onrender.com/hrmbuses')
            .then(response => response.json())
            .then((data) => {

                const filterData = data.entity.filter(
                    (bus) => bus.vehicle.trip.routeId >= 1 && bus.vehicle.trip.routeId <= 10
                );



                const geoJson = geoJSONFromData(filterData);

                //updateMapWithCustomMarkers(geoJson);
                console.log(filterData)
                // data(bus => {
                //     const { lat, lon, rotationAngle } = bus;

                //     // Create a sample marker with rotation
                //     const rotatedMarker = L.rotatedMarker([44.650690, -63.596537], {
                //         rotationAngle: 45, // Set the rotation angle in degrees
                //         icon: L.icon({
                //             iconUrl: './bus.png',
                //             iconSize: [32, 32]
                //         }),
                //     }).addTo(map)
                // });
            });
    }

    function geoJSONFromData(data) {
        return {
            type: "FeatureCollection",
            features: data.map((bus) => ({
                type: "Feature",
                properties: {
                    bearing: bus.vehicle.position,
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

    function refreshMap() {
        map.eachLayer((layer) => {
            if (layer instanceof L.geoJson) {
                map.removeLayer(layer);
            }
        });
        fetchTransitData();
    }

    setInterval(refreshMap, 15000);

    const customIcon = L.icon({

    })

    // L.marker([44.650690, -63.596537]).addTo(map)
    //     .bindPopup('bus')
    //     .openPopup();


})()