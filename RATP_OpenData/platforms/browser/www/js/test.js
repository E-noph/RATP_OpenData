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

        // A utiliser juste pour les postes qui on les fichier serveurs et la BDD (demandé à Julien)
        this.getStation("Madeleine");

        this.callAPICloseTo("2.37768;48.85334");
        //this.callAPIStation("59300","20170615T164106&");
        this.callAPIItineraire("%3AOIF%3ASA%3A59300","%3AOIF%3ASA%3A59522","20170615T164106&");
    }

    /**
     * Fonction qui appelle notre base de données et récupére tous les noms de stations ainsi que leurs codes et coordonnées.
     */
    getStation(station) {
        $.ajax({
            url: this._Host + this._apiURIstation,
            data: {station: station},
            dataType : "json",
            success : function(data)
            {
                console.log('getAPI response', data);
                test.callAPIStation(data[0].stop_area,"20170615T164106&");
            }
        });
    }

    /**
     * Fonction qui appelle l'API nativia pour récupérer les datas des stations à proximité
     * @param coords
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

    /**
     * Fonction qui appelle l'API navitia pour récupérer les passages des prochains transports à un point donné
     * @param codeStation
     * @param dateTime
     */
    callAPIStation(codeStation, dateTime) {
        var result = "";

        $.ajax({
            url: this._APINativia + "stop_areas/stop_area%3AOIF%3ASA%3A"+codeStation+"/arrivals?from_datetime="+dateTime,
        }).done($.proxy(function(data){

            let res = data;
            console.log('getAPIstation response', res);

            // Boucle pour récup les infos des stations
            for (var i = 0; i < data.arrivals.length; i++) {

                result += '<p>' + data.arrivals[i].display_informations.commercial_mode + data.arrivals[i].display_informations.code +
                    ', Sa destination est ' + data.arrivals[i].display_informations.direction + '</p></br>';
            }

            $$('#test-page-content').html(result);

        }, this)).fail(function( jqXHR, textStatus, errorThrown )  {
            console.log('CALL API STATION FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }

}