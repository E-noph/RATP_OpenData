/**
 * Created by Julien on 13/06/2017.
 */
"use strict";

class Application {
    /**
     *
     */
    constructor() {
        this._serverPhonegap = location.href.split(':')[1].substr(2);
        this._distance = "50";

        // powered by the server
        this._Host = 'http://134.157.46.190:3000/';
        this._APINativia = 'https://9a515a8c-7b22-456e-8e0d-6bdddfd9206f@api.navitia.io/v1/coverage/fr-idf/';

        // views
        this._test = new TestView();

        console.log("++++++++++", this._serverPhonegap);

    }

    /**
     * Get API Nativia pour les stations à proximité
     */
    callAPICloseTo(coords) {
        $.ajax({
            url: this._APINativia + "coords/"+coords+"/lines?distance="+this._distance,
        }).done($.proxy(function(data){

            let res = data;
            console.log('getAPIcloseTo response', res);

        }, this)).fail(function( jqXHR, textStatus, errorThrown )  {
            console.log('CALL API CLOSETO FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }

    /**
     * Get API Nativia pour les horaires des transports à la station recherché
     */
    callAPIStation(codeStation, dateTime) {
        $.ajax({
            url: this._APINativia + "stop_areas/stop_area"+codeStation+"/arrivals?from_datetime="+dateTime,
        }).done($.proxy(function(data){

            let res = data;
            console.log('getAPIstation response', res);

        }, this)).fail(function( jqXHR, textStatus, errorThrown )  {
            console.log('CALL API STATION FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }

    /**
     * Get API Nativia pour recherche d'itinéraire
     */
    callAPIItineraire(codeStationFrom, codeStationTo, dateTime) {
        $.ajax({
            url: this._APINativia + "journeys?from=stop_area"+codeStationFrom+"&to=stop_area"+codeStationTo+"&datetime="+dateTime,
        }).done($.proxy(function(data){

            let res = data;
            console.log('getAPIitinearaire response', res);

        }, this)).fail(function( jqXHR, textStatus, errorThrown )  {
            console.log('CALL API ITINERAIRE FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }

    /**
     *
     */
    initTest() {
        this._test.init();
    }


}
