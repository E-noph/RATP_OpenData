/**
 * Created by Julien on 21/06/2017.
 */

class CloseToView {

    constructor() {
        this._APINativia = 'https://9a515a8c-7b22-456e-8e0d-6bdddfd9206f@api.navitia.io/v1/coverage/fr-idf/';
        this._distance = "300&";
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
                let long = pos.lng.toString().substring(0, 7);
                let lati = pos.lat.toString().substring(0, 7);
                let coords = long+"%3B"+lati;
                console.log(coords);
                closeTo.callAPICloseTo(coords);
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

    /**
     * Fonction qui appelle l'API nativia pour récupérer les stations métro à proximité
     * @param coords
     */
    callAPICloseTo(coords) {
        console.log(this._APINativia + "coord/"+coords+"/stop_areas?distance="+this._distance);
        $.ajax({
            url: this._APINativia + "coord/"+coords+"/departures?distance="+this._distance,
        }).done($.proxy(function(data){

            let res = data;
            console.log('getAPIcloseTo response', res);

            var stationClose = "";

            if (data.departures.length != 0) {
                for (var i = 0; i < data.departures.length; i++) {
                    if (data.departures[i].display_informations.commercial_mode == "Métro") {

                        let codeStation = data.departures[i].stop_point.stop_area.id;
                        codeStation = codeStation.split(":");

                        stationClose += '<li class="swipeout">' +
                            '<div class="swipeout-content item-content">' +
                            '<div class="item-inner">' +
                            '<a href="nextTrains.html?codeStation=' + codeStation[3] + '=' + data.departures[i].stop_point.stop_area.name + '">' +
                            '<div class="item-title">' + data.departures[i].stop_point.stop_area.name + '</div>' +
                            '</a>' +
                            '</div>' +
                            '</div>' +
                            '</li>';
                    }
                }
                $$('#list-closeTo').html(stationClose);

            } else {
                stationClose += "<p>Aucune station de métro à moins de 300m</p>";

                $$('#list-closeTo').html(stationClose);
            }

        }, this)).fail(function( jqXHR, textStatus, errorThrown )  {
            console.log('CALL API CLOSETO FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }
}