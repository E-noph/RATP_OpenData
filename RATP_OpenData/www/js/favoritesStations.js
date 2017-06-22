/**
 * Created by Julien on 22/06/2017.
 */

class FavoritesStationsView {

    constructor() {
        console.log("FavoritesStationsView:constructor()");
        this._Host = 'http://localhost/';
        this._apiURIFavoritesStation = 'server/favoritesStations.php';
    }

    init(id) {
        console.log("FavoritesStationsView:init()");
        console.log(id);

        this.getFavoritesStation(id);
    }

    getFavoritesStation(id) {

        if (id == "") {
            let messageConnexion = '<p>Veuillez vous connecter pour voir vos favoris</p>';

            $$('#list-favorites-stations').html(messageConnexion);
        } else {
            $.ajax({
                url: this._Host + this._apiURIFavoritesStation,
                data : {id : id},
                dataType : "json",
                success : function(data)
                {
                    var favoritesStations= "";

                    console.log('getAPIFavoritesStations response', data);
                    console.log(data.length);
                    console.log(data[0].name);

                    for (var i = 0; i < data.length; i++) {
                        favoritesStations += '<li class="item-content">' +
                                                 '<div class="item-inner">' +
                                                    '<a href="nextTrains.html?codeStation='+data[i].stop_area+'='+data[i].name+'">' +
                                                        '<div class="item-title">'+data[i].name+'</div>' +
                                                    '</a>' +
                                                 '</div>' +
                                             '</li>';
                    }
                    $$('#list-favorites-stations').html(favoritesStations);

                }
            });
        }
    }

}