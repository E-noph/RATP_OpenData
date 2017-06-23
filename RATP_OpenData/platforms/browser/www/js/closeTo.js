/**
 * Created by Julien on 21/06/2017.
 */

class CloseToView {

    constructor() {
        console.log("closeTo:constructor()");
    }

    init() {
        console.log("closeTo:init()");
        console.log();

        this.initMap();
    }

    initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 16,
            zoomControl : false,
            scrollwheel : false,
            draggable : false,
            disableDoubleClickZoom : true,
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Location found.');
                map.setCenter(pos);
            }, function() {
                closeTo.handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            closeTo.handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }
}