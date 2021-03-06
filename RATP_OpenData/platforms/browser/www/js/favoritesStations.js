/**
 * Created by Julien on 22/06/2017.
 */

class FavoritesStationsView {

    constructor() {
        this._Host = 'http://134.157.46.190/';
        this._apiURIFavoritesStations = 'server/favoritesStations.php';
        this._apiURIDeleteFavoriteStation = 'server/deleteFavoriteStation.php';
    }

    init(id) {
        console.log("FavoritesStationsView:init()");
        console.log(id);

        this.getFavoritesStation(id);
    }

    /**
     * Fonction Récupérer les station favorites de l'utilisateur
     * @param id
     */
    getFavoritesStation(id) {

        if (id == "") {
            let messageConnexion = '<div class="content-block favorites-error-connect"><div class="content-block-inner"><a href="#" class="back link">Veuillez vous connecter pour voir vos favoris.</a></div></div>';

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
                        favoritesStations += '<div class="content-block favorites-error-connect"><div class="content-block-inner"><a href="#" class="back link">Vous n\'\avez aucun favori. Recherchez une station et ajoutez la dans vos favoris en cliquant sur l\'\étoile.</a></div></div>';

                        $$('#list-favorites-stations').html(favoritesStations);
                    }
                }
            });
        }
    }

    /**
     * Fonction pour supprimer une station favorite d'un utilisateur
     * @param idFav
     * @param id
     */
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