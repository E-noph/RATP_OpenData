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

    init() {
        console.log("=============== Test::init() ========== ");
        console.log( this._Host + this._apiURIstation);

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

                app.callAPIStation(data[0].stop_area,"20170615T164106&", $.proxy(function (data) {
                    if (data.error) {
                        console.log('get image ERROR', data);
                    }
                    else {
                        console.log('get image response', data);

                    }
                }, this));
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
}