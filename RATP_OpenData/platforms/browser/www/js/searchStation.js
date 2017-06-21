// Created on June 19th by Laurent

class SearchStationView {

    constructor() {
        console.log("searchStation:constructor()");
        this._Host = 'http://localhost/';
        this._apiURIstation = 'server/station.php';
    }

    init() {
        console.log("searchStation::init()");

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
                                                        '<a href="nextTrains.html">' +
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

}