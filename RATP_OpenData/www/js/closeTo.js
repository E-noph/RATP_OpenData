/**
 * Created by Julien on 21/06/2017.
 */

class CloseToView {

    constructor() {
        this._APINativia = 'https://9a515a8c-7b22-456e-8e0d-6bdddfd9206f@api.navitia.io/v1/coverage/fr-idf/';
        this._distance = "400&";

        this._stationCloseToList = [];

        console.log("closeTo:constructor()");
    }

    init() {
        console.log("closeTo:init()");
        console.log();

        this.initMap();
    }

    /**
     * Fonction d'initiation de la géolocalisation sur map Google
     */
    initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 16,
            zoomControl : false,
            scrollwheel : false,
            draggable : false,
            disableDoubleClickZoom : true,
        });

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                });

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

    /**
     * Fonction erreur sur la géolocalisation de la map Google
     * @param browserHasGeolocation
     * @param infoWindow
     * @param pos
     */
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
            url: this._APINativia + "coord/"+coords+"/departures?distance="+this._distance+"count=25&",
        }).done($.proxy(function(data){

            let res = data;
            console.log('getAPIcloseTo response', res);

            var stationClose = "";

            if (data.departures.length != 0) {
                for (var i = 0; i < data.departures.length; i++) {
                    if (data.departures[i].display_informations.commercial_mode == "Métro") {

                        let codeStation = data.departures[i].stop_point.stop_area.id;
                        codeStation = codeStation.split(":");

                        this._stationCloseToList.push(codeStation[3]+"|"+data.departures[i].stop_point.stop_area.name);
                        var codeStationArray = closeTo.cleanArray(this._stationCloseToList);

                    }
                }

                console.log(codeStationArray);

                for (var i = 0; i < codeStationArray.length; i++) {
                    let data = codeStationArray[i].split("|");
                    let codeStation = data[0];
                    let nameStation = data[1];

                    stationClose += 
                        '<a class="grey-text" href="nextTrains.html?codeStation=' + codeStation + '=' + nameStation + '">' +
                        '<li class="item-content">' +
                        '<div class="item-media"><i class="fa fa-map-marker" aria-hidden="true"></i></div>' +
                        '<div class="item-inner">' +
                        
                        '<div class="item-title">' + nameStation + '</div>' +
                        
                        '<div class="item-after"><i class="f7-icons">chevron-right</i></div>' +
                        '</div>' +
                        '</div>' +
                        '</li>'+
                        '</a>' ;

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

    /**
     * Fonction pour retirer les duplicata d'un array
     * @param array
     * @returns {Array}
     */
    cleanArray(array) {
        var i, j, len = array.length, out = [], obj = {};
        for (i = 0; i < len; i++) {
            obj[array[i]] = 0;
        }
        for (j in obj) {
            out.push(j);
        }
        return out;
    }

}