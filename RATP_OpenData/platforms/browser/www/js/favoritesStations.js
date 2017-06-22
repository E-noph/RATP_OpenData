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

                    for (var i = 0; i < data.length; i++) {
                        favoritesStations += '<li class="swipeout">'+
                                                '<div class="swipeout-content item-content">' +
                                                    '<div class="item-inner">' +
                                                        '<a href="nextTrains.html?codeStation='+data[i].stop_area+'='+data[i].name+'">' +
                                                            '<div class="item-title">'+data[i].name+'</div>' +
                                                        '</a>' +
                                                    '</div>' +
                                                    '<div class="swipeout-actions-right">' +
                                                        '<a href="#" id="'+i+'-delete" class="delete action2 bg-red" style="text-align: center;">Supprimer ce favori</a>' +
                                                    '</div>'+
                                                '</div>' +
                                             '</li>';
                    }
                    $$('#list-favorites-stations').html(favoritesStations);

                    this.btnDelete = $$('.delete');
                    //this.btnDelete.click($.proxy(this.deleteFavorite, this));
                }
            });
        }
    }

    deleteFavorite(event){
        myApp.swipeoutClose();
        console.log("Favorites deleted !!!");
        myDB.transaction(function(transaction) {
            transaction.executeSql('DELETE FROM account_list WHERE id = '+app._accountList.rows[parseInt(event.srcElement.id)].id, [],
                function (tx, result) {
                    // Update view's account list and reload
                    transaction.executeSql('SELECT * FROM account_list', [],
                        function (tx, results) {
                            app._accountList = null;
                            app._accountList = results;
                            app._accountManager.displayAccountList();
                        }, function () {
                            console.log("!!!!");
                        }
                    );
                },
                function (error) {
                    console.log("!!!!");
                });
        });
    }

}