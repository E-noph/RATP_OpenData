// Created on June 19th by Laurent

class StationView {

    constructor() {
        console.log("searchStation:constructor()");
        this._APINativia = 'https://9a515a8c-7b22-456e-8e0d-6bdddfd9206f@api.navitia.io/v1/coverage/fr-idf/';
        this._distance = "50";
        this._Host = 'http://localhost/';
        this._apiURIstation = 'server/station.php';
    }

    init() {
        console.log("Station::init()");

        this.getStation();

    }

    /**
     * Fonction qui appelle notre base de données et récupére tous les noms de stations ainsi que leurs codes et coordonnées.
     */
    getStation() {
        $.ajax({
            url: this._Host + this._apiURIstation,
            dataType : "json",
            success : function(data)
            {
                var itemStationSearchBar = "";

                console.log('getAPIstation response', data);
                console.log(data[0].name);
                
                for (var i = 0; i < data.length; i++) {
                        itemStationSearchBar += '<li class="item-content">' +
                                                    '<div class="item-inner">' +
                                                        '<a href="nextTrains.html?codeStation='+data[i].stop_area+'='+data[i].name+'">' +
                                                            '<div class="item-title">'+data[i].name+'</div>' +
                                                        '</a>' +
                                                    '</div>' +
                                                '</li>';
                }
               $$('#list-items-stations').html(itemStationSearchBar);

                //test.callAPIStation(data[0].stop_area,"20170615T164106&");
            }
        });
    }

    /**
     * Fonction d'init de la page html nextTrains
     * @param codeStation
     * @param nameStation
     */
    initDataTrains(codeStation, nameStation) {
        console.log("nextTrains:Init()")
        console.log(codeStation);
        console.log(nameStation);

        this.callAPIStation(codeStation, "20170615T164106&", nameStation);
    }


    /**
     * Fonction qui appelle l'API navitia pour récupérer les passages des prochains transports à un point donné
     * @param codeStation
     * @param dateTime
     */
    callAPIStation(codeStation, dateTime, nameStation) {
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

            $$('#next-station-page-content').html(result);

        }, this)).fail(function( jqXHR, textStatus, errorThrown )  {
            console.log('CALL API STATION FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }
}