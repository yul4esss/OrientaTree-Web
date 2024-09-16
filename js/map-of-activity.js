import { database, ref, set, remove, get } from './database-connection.js';

// Initialize the map
var map = L.map('map').setView([41.645870, -4.7296108], 17);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var markers = [];
var lines = L.layerGroup().addTo(map); // Create a layer group for lines
var startPoint = null; // Variable for the start point
var canAddMarkers = false; // Flag to check if markers can be added

document.addEventListener('DOMContentLoaded', function() {
    loadMarkersFromDatabase(); // Call the function to load markers and start point from the database

    document.getElementById('deleteMarkers').onclick = function() {
        if (confirm('Are you sure you want to delete all markers and the start point?')) {
            // Remove all markers from the map and markers array
            for (var i = 0; i < markers.length; i++) {
                map.removeLayer(markers[i]);
                map.removeLayer(startPoint);
            }
            markers = [];
            canAddMarkers = false; // Reset flag to prevent adding markers

            // Remove all markers and start point from the database
            remove(ref(database, 'markers'))
                .then(() => {
                    console.log("All markers removed successfully!");
                })
                .catch((error) => {
                    console.error("Error removing data: ", error);
                });

            // Clear lines layer
            lines.clearLayers();
        }
    };

    document.getElementById('connectMarkers').onclick = function() {
        // Connect markers with lines
        if (markers.length >= 2) {
            redrawLines();
        } else {
            alert('To connect, you need at least 2 markers');
        }
    };

    document.getElementById('setStartPoint').onclick = function() {
        if (canAddMarkers) {
            alert('Start Point is already set');
        } else {
            alert('You need to click on the map to set the start point');
        }
    };

    window.addEventListener('resize', adjustImageContainerSize);

    function adjustImageContainerSize() {
        var mapElement = document.getElementById('map');
        var imageContainer = document.getElementById('image-container');
        
        // Get the size of the map
        var mapHeight = mapElement.offsetHeight;
        var mapWidth = mapElement.offsetWidth;

        // Set the size of the image container to match the map
        imageContainer.style.height = mapHeight + 'px';
        imageContainer.style.width = mapWidth + 'px';
    }

    // Add start point on map click
    map.on('click', function(e) {
        var latitude = e.latlng.lat;
        var longitude = e.latlng.lng;

        if (!canAddMarkers) {
            // Set the start point marker
            startPoint = L.marker([latitude, longitude], {
                icon: L.divIcon({
                    className: 'start-point-icon',
                    html: '<div class="start-point"></div>', // Triangle shape
                    iconSize: [20, 20]
                })
            }).addTo(map);

            // Add a popup with a label for the start point
            startPoint.bindPopup('Start Point').openPopup();

            // Save the start point to the database as a marker
            saveMarkerToDatabase('startPoint', latitude, longitude);

            // Set the flag to allow adding markers
            canAddMarkers = true;
        } else {
            // Add a new marker
            var marker = L.marker([latitude, longitude], {
                icon: L.divIcon({
                    className: 'custom-div-icon',
                    html: "<div class='number'>" + (markers.length + 1) + "</div>",
                    iconSize: [30, 30]
                })
            }).addTo(map);
            markers.push(marker);

            // Save the marker coordinates to the database
            saveMarkersToDatabase();

            // Add a popup with a delete button
            marker.bindPopup(`
                <div>
                    <button class="delete-btn">Delete Marker</button>
                </div>
            `);

            // Add marker click event handler
            marker.on('click', function(e) {
                // Show the popup when the marker is clicked
                marker.openPopup();
            });

            // Add event listener for the delete button
            marker.on('popupopen', function() {
                // Use setTimeout to ensure the button is added to the DOM
                setTimeout(() => {
                    const deleteButton = document.querySelector('.delete-btn');
                    if (deleteButton) {
                        deleteButton.onclick = function() {
                            // Remove the marker from the map
                            map.removeLayer(marker);

                            // Find the index of the marker in the markers array
                            var index = markers.indexOf(marker);
                            if (index > -1) {
                                // Remove the marker from the markers array
                                markers.splice(index, 1);

                                // Save the updated markers to the database
                                saveMarkersToDatabase();

                                // Recount marker IDs
                                updateMarkerIDs();

                                // Clear and redraw lines
                                redrawLines();
                            }

                            // Close the popup
                            marker.closePopup();
                        };
                    }
                }, 0); // 0 ms delay to ensure DOM updates
            });

            // Automatically connect the last marker to the start point
            redrawLines();
        }
    });

    function updateMarkerIDs() {
        // Update marker IDs based on their position in the markers array
        for (var i = 0; i < markers.length; i++) {
            markers[i].getElement().innerHTML = "<div class='number'>" + (i + 1) + "</div>";
        }
    }

    function saveMarkersToDatabase() {
        var updates = {};
        for (var i = 0; i < markers.length; i++) {
            var markerId = 'marker_' + (i + 1);
            var marker = markers[i];
            var latLng = marker.getLatLng();
            updates[markerId] = {
                latitude: latLng.lat,
                longitude: latLng.lng
            };
        }

        // Save the start point separately
        if (startPoint) {
            var startLatLng = startPoint.getLatLng();
            updates['startPoint'] = {
                latitude: startLatLng.lat,
                longitude: startLatLng.lng
            };
        }

        set(ref(database, 'markers'), updates)
            .then(() => {
                console.log("Markers saved successfully!");
            })
            .catch((error) => {
                console.error("Error saving markers: ", error);
            });
    }

    function saveMarkerToDatabase(id, lat, lng) {
        set(ref(database, 'markers/' + id), { latitude: lat, longitude: lng })
            .then(() => {
                console.log("Marker saved successfully!");
            })
            .catch((error) => {
                console.error("Error saving marker: ", error);
            });
    }

    function loadMarkersFromDatabase() {
        get(ref(database, 'markers'))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    markers.forEach(marker => map.removeLayer(marker)); // Clear existing markers
                    markers.length = 0; // Clear the markers array

                    Object.keys(data).forEach(key => {
                        const { latitude, longitude } = data[key];
                        const isStartPoint = key === 'startPoint';
                        
                        if (isStartPoint) {
                            // Handle the start point separately
                            startPoint = L.marker([latitude, longitude], {
                                icon: L.divIcon({
                                    className: 'start-point-icon',
                                    html: '<div class="start-point"></div>', // Triangle shape
                                    iconSize: [20, 20]
                                })
                            }).addTo(map); // Save the start point
                            canAddMarkers = true; // Allow adding markers
                            startPoint.bindPopup('Start Point');
                        } else {
                            // Create and add a new marker
                            var marker = L.marker([latitude, longitude], {
                                icon: L.divIcon({
                                    className: 'custom-div-icon',
                                    html: "<div class='number'>" + (markers.length + 1) + "</div>",
                                    iconSize: [30, 30]
                                })
                            }).addTo(map);
                            markers.push(marker);

                            // Add a popup with a delete button
                            marker.bindPopup(`
                                <div>
                                    <button class="delete-btn">Delete Marker</button>
                                </div>
                            `);

                            marker.on('click', function(e) {
                                // Show the popup when the marker is clicked
                                marker.openPopup();
                            });

                            // Add event listener for the delete button
                            marker.on('popupopen', function() {
                                // Use setTimeout to ensure the button is added to the DOM
                                setTimeout(() => {
                                    const deleteButton = document.querySelector('.delete-btn');
                                    if (deleteButton) {
                                        deleteButton.onclick = function() {
                                            // Remove the marker from the map
                                            map.removeLayer(marker);

                                            // Find the index of the marker in the markers array
                                            var index = markers.indexOf(marker);
                                            if (index > -1) {
                                                // Remove the marker from the markers array
                                                markers.splice(index, 1);

                                                // Save the updated markers to the database
                                                saveMarkersToDatabase();

                                                // Recount marker IDs
                                                updateMarkerIDs();

                                                // Clear and redraw lines
                                                redrawLines();
                                            }

                                            // Close the popup
                                            marker.closePopup();
                                        };
                                    }
                                }, 0); // 0 ms delay to ensure DOM updates
                            });
                        }
                    });

                    redrawLines(); // Draw lines after markers are loaded
                    updateMarkerIDs(); // Update marker IDs
                    console.log("Markers and start point loaded successfully!");
                } else {
                    console.log("No markers found in the database.");
                }
            })
            .catch((error) => {
                console.error("Error loading markers:", error);
            });
    }

    function redrawLines() {
        lines.clearLayers(); // Clear existing lines

        if (markers.length >= 1) {
            // Draw a line from the start point to the first marker
            if (startPoint && canAddMarkers) {
                lines.addLayer(L.polyline([startPoint.getLatLng(), markers[0].getLatLng()], { color: 'green', weight: 2 }));
            }

            if (markers.length >= 2) {
                // Draw lines between markers
                lines.addLayer(L.polyline(markers.map(function(marker) {
                    return marker.getLatLng();
                }), { color: 'green', weight: 2 }));

                // Draw a line from the last marker to the start point
                if (startPoint && canAddMarkers) {
                    lines.addLayer(L.polyline([markers[markers.length - 1].getLatLng(), startPoint.getLatLng()], { color: 'green', weight: 2 }));
                }
            }
        }
    }

    function saveMapData(mapData = {}) {
        // Save the current state of the map to the database
        var updates = {};

        if (startPoint) {
            var startLatLng = startPoint.getLatLng();
            updates['startPoint'] = {
                latitude: startLatLng.lat,
                longitude: startLatLng.lng
            };
        }

        for (var i = 0; i < markers.length; i++) {
            var markerId = 'marker_' + (i + 1);
            var marker = markers[i];
            var latLng = marker.getLatLng();
            updates[markerId] = {
                latitude: latLng.lat,
                longitude: latLng.lng
            };
        }

        set(ref(database, 'mapData'), updates)
            .then(() => {
                console.log("Map data saved successfully!");
            })
            .catch((error) => {
                console.error("Error saving map data: ", error);
            });
    }

    document.getElementById('setStartPoint').onclick = function() {
        if (!canAddMarkers) {
            alert('You need to click on the map to set the start point');
        } else {
            alert('Start Point is already set');
        }
    };
});
