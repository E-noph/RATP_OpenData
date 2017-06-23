/**
 * Created by Julien on 22/06/2017.
 */

class FavoritesStationsView {

    constructor() {
        console.log("FavoritesStationsView:constructor()");
        this._Host = 'http://localhost/';
        this._apiURIFavoritesStations = 'server/favoritesStations.php';
        this._apiURIDeleteFavoriteStation = 'server/deleteFavoriteStation.php';
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
                url: this._Host + this._apiURIFavoritesStations,
                data : {id : id},
                dataType : "json",
                success : function(data)
                {
                    var favoritesStations= "";

                    console.log('getAPIFavoritesStations response', data);
                    if (data.length != 0) {
                        for (var i = 0; i < data.length; i++) {
                            favoritesStations += '<li class="swipeout">'+
                                                    '<div class="swipeout-content item-content">' +
                                                        '<div class="item-inner">' +
                                                            '<a href="nextTrains.html?codeStation='+data[i].stop_area+'='+data[i].name+'">' +
                                                                '<div class="item-title">'+data[i].name+'</div>' +
                                                            '</a>' +
                                                        '</div>' +
                                                    '</div>' +
                                                    '<div class="swipeout-actions-right">' +
                                                        '<a href="#" id="'+data[i].idPoint+'" class="delete action1 bg-red"><i class="f7-icons">trash</i></a>' +
                                                    '</div>'+
                                                 '</li>';
                        }
                        $$('#list-favorites-stations').html(favoritesStations);


                        $$('.delete').on('click', $.proxy(function(e) {
                            var el= e.target||event.srcElement;
                            console.log(el.id);
                            setTimeout(favStation.deleteFavorite(el.id, id),1000);
                        }));
                    } else {
                        favoritesStations += "<p>Vous n'avez pas de favoris</p>";

                        $$('#list-favorites-stations').html(favoritesStations);
                    }
                }
            });
        }
    }


    deleteFavorite(idFav, id){
        myApp.swipeoutClose();
        console.log(" deleteFavorite:Init ");
        console.log(idFav);

        $.ajax({
            url: this._Host + this._apiURIDeleteFavoriteStation,
            data: 'idFav=' + idFav,
            success : function(data) {
                console.log("refds");
                favStation.getFavoritesStation(id);
            }
        });
    }

}