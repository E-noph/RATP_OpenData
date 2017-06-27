/**
 * Created by Julien on 20/06/2017.
 */

class AccountManager {

    constructor() {

    }

    init(id) {
        console.log("Account:init()");

        this.btnBack = $$('#btn-back-home');
        this.displayAccountList(id);
    }

    /**
     *  Affiche les comptes utilisateurs de la base de données mobiles
     */
    displayAccountList(id){

        let chaine = '<ul>',
            i = 0;
        if (id != 0) {
            if (app._accountList.length != 0) {
                while (i < app._accountList.rows.length) {
                    chaine += '<li class="accordion-item">' +
                        // '<a href="#" class="item-content item-link">' +
                        // '<div class="item-inner">' +
                        // '<div class="item-title">Vos comptes </div>' +
                        // '</div>' +
                        // '</a>' +
                        '<div class="accordion-item-content">' +
                        '<ul>';
                    while (app._accountList.rows[i]) {
                        chaine += '<div class="list-block">' +
                            '<li class="swipeout">' +
                            '<div class="swipeout-content item-content">';

                        if (app._accountList.rows[i].isDefault) {

                            // If the current account is the default account, expand its parent accordion block
                            let pos = chaine.lastIndexOf('"accordion-item"') + 15,
                                sliceLeft = chaine.slice(0, pos),
                                sliceRight = chaine.slice(pos);
                            chaine = sliceLeft + " accordion-item-expanded " + sliceRight;

                            // If the current account is the default account, add user accounts to the current server user list
                            chaine += '<div class="item-media">' +
                                '<i class="f7-icons icon-green">star_fill</i>' +
                                '</div>' +
                                '<div value="' + i + '"  class="item-inner" >' + app._accountList.rows[i].user + '</div>';
                        } else {
                            // Add user accounts to the current server user list
                            chaine += '<div class="item-media">' +
                                '</div>' +
                                '<div value="' + i + '"  class="item-inner" >' + app._accountList.rows[i].user + '</div>';
                        }

                        // Add swipe-out action buttons to each user account item
                        chaine += '</div>' +
                            '<div class="swipeout-actions-right">' +
                            '<a href="#" id="' + i + '-default" class="default action1 bg-orange">Par défaut</a>' +
                            '<a href="#" id="' + i + '-delete" class="delete action2 bg-red">Supprimer</a>' +
                            '</div>' +
                            '</li>';
                        i++;
                    }
                    chaine += '</div>' +
                        '</ul>' +
                        '</div>';
                }
                chaine += '</li>' +
                    '</ul>';
                $$('#account-list').html(chaine);

                this.btnDefault = $$('.default');
                this.btnDefault.click($.proxy(this.defineFavorite, this));
                this.btnDelete = $$('.delete');
                this.btnDelete.click($.proxy(this.deleteAccount, this));

            }

        } else {
            chaine += '<div class="content-block favorites-error-connect"><div class="content-block-inner"><a href="#" class="back link">Veuillez vous connecter pour gérer les utilisateurs.</a></div></div>';
            $$('#account-list').html(chaine);
        }
    }

    /**
     *  Fonction pour supprimer un compte utilisateru de la base du téléphone
     * @param event
     */
    deleteAccount(event){
        myApp.swipeoutClose();
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

    /**
     * Fonction pour definir l'utilisateur par défaut
     * @param event
     */
    defineFavorite(event){
        myApp.swipeoutClose();
        myDB.transaction(function(transaction) {
            transaction.executeSql('UPDATE account_list SET isDefault = 0 WHERE isDefault = 1', [],
                function (tx, result) {
                    transaction.executeSql('UPDATE account_list SET isDefault = 1 WHERE id = '+app._accountList.rows[parseInt(event.srcElement.id)].id, [],
                        function (tx, result) {
                            // Update view's account list and reload
                            myDB.transaction(function(transaction) {
                                transaction.executeSql('SELECT * FROM account_list', [],
                                    function (tx, results) {
                                        app._accountList = results;
                                        app._accountManager.displayAccountList();
                                    },function(){
                                        console.log("Error 1 define favorite");
                                    });
                            });
                        },
                        function (error) {
                            console.log("Error 2 define favorite");
                        });
                },
                function (error) {
                    console.log("Error 3 define favorite");
                });
        });
    }

}