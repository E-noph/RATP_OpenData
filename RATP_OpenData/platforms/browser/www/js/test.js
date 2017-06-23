/**
 * Created by Julien on 13/06/2017.
 */

class TestView {

    constructor() {
        console.log("=============== Test::constructor() ========== ");
        this._APINativia = 'https://9a515a8c-7b22-456e-8e0d-6bdddfd9206f@api.navitia.io/v1/coverage/fr-idf/';
        this._distance = "50";
        this._Host = 'http://localhost/';
        this._apiURIstation = 'server/station.php';
    }

    init(api) {
        console.log("=============== Test::init() ========== ");
        console.log( this._Host + this._apiURIstation);
        this._api = api;

        this.callAPICloseTo("2.37768;48.85334");
        this.callAPIItineraire("%3AOIF%3ASA%3A59300","%3AOIF%3ASA%3A59522","20170615T164106&");
    }


    /**
     * Fonction qui appelle l'API navitia pour itinéraire d'un parcours demandé
     * @param codeStationFrom
     * @param codeStationTo
     * @param dateTime
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

}