// IIFE
(() => {

    //create map in leaflet and tie it to the div called 'theMap'
    let map = L.map('theMap').setView([44.650627, -63.597140], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Fetch live bus data
    fetch('https://prog2700.onrender.com/hrmbuses')
        .then(response => response.json())
        .then(data => {
            // Loop through the data and create markers with rotation
            data.forEach(bus => {
                const { lat, lon, rotationAngle } = bus;

                // Create a sample marker with rotation
                const rotatedMarker = L.rotatedMarker([44.650690, -63.596537], {
                    rotationAngle: 45, // Set the rotation angle in degrees
                    icon: L.icon({
                        iconUrl: './bus.png',
                        iconSize: [32, 32]
                    }),
                }).addTo(map)
            });
        });



    L.marker([44.650690, -63.596537]).addTo(map)
        .bindPopup('This is a sample popup. You can put any html structure in this including extra bus data. You can also swap this icon out for a custom icon. A png file has been provided for you to use if you wish.')
        .openPopup();


})()