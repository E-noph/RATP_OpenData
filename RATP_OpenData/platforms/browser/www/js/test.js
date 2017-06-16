/**
 * Created by Julien on 13/06/2017.
 */

class TestView {

    constructor() {
        console.log("=============== Test::constructor() ========== ");
    }

    init(server) {
        console.log("=============== Test::init() ========== ");
        console.log(server);

        this.dataAPICloseTo("2.37768;48.85334");
        this.dataAPIStation("%3AOIF%3ASA%3A59300","20170615T164106&");
        this.dataAPIItineraire("%3AOIF%3ASA%3A59300","%3AOIF%3ASA%3A59522","20170615T164106&")

    }

    /**
     * Fonction qui appelle l'API nativia pour récupérer les datas des stations à proximité
     * @param coords
     */
    dataAPICloseTo(coords) {
        app.callAPICloseTo(coords, $.proxy(function(data) {
            if (data.error) {
                console.log('dataAPICloseTo ERROR', data);
            }
            else {
                console.log('dataAPICloseTo response', data);
            }
        }, this));
    }

    /**
     * Fonction qui appelle l'API navitia pour récupérer les passages des prochains transports à un point donné
     * @param codeStation
     * @param dateTime
     */
    dataAPIStation(codeStation, dateTime) {
        app.callAPIStation(codeStation,dateTime, $.proxy(function(data) {
            if (data.error) {
                console.log('dataAPIStation ERROR', data);
            }
            else {
                console.log('dataAPIStation response', data);
            }
        }, this));
    }

    /**
     * Fonction qui appelle l'API navitia pour itinéraire d'un parcours demandé
     * @param codeStationFrom
     * @param codeStationTo
     * @param dateTime
     */
    dataAPIItineraire(codeStationFrom,codeStationTo, dateTime) {
        app.callAPIItineraire(codeStationFrom,codeStationTo,dateTime, $.proxy(function(data) {
            if (data.error) {
                console.log('dataAPIItineraire ERROR', data);
            }
            else {
                console.log('dataAPIItineraire response', data);
            }
        }, this));
    }

}