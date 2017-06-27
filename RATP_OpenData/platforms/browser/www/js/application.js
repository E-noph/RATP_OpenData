/**
 * Created by Julien on 13/06/2017.
 */
"use strict";

class Application {
    /**
     *
     */
    constructor() {
        this._serverPhonegap = location.href.split(':')[1].substr(2);
        this._user = "";
        this._APINativia = 'https://9a515a8c-7b22-456e-8e0d-6bdddfd9206f@api.navitia.io/v1/coverage/fr-idf/';
        this._APIServer = 'http://localhost/server/';


        // views
        this._accountManager = new AccountManager();
        this._station = new StationView();
        this._closeTo = new CloseToView();
        this._pathItinerary = new PathItineraryView();
        this._favorites = new FavoritesStationsView();
        this._subscribe = new SubscribeView();

        this._accountList = [];
        this._userList = [];

        this._userID = '';
        this._username = '';

        console.log("++++++++++", this._serverPhonegap);

    }

    /**
     * Get APIServer
     */
    getAPI() {

        // Fetch accounts information from local database (SQLite)
        myDB.transaction(function (transaction) {

            // Create a table in the local database or use the existing one
            transaction.executeSql('CREATE TABLE account_list (id INTEGER PRIMARY KEY, user TEXT NOT NULL, isDefault BOOLEAN NOT NULL)', [],
                function (tx, result) {
                    console.log("Table created successfully");
                },
                function (error) {
                    console.log("Table already exists");
                }
            );

            // Create trigger for default account update
            myDB.transaction(function (transaction) {
                transaction.executeSql('CREATE TRIGGER trigger_setdefault BEFORE INSERT ON account_list WHEN NEW.isDefault = 1 BEGIN UPDATE account_list SET isDefault = 0; END', [],
                    function (tx, result) {
                        console.log("TRIGGER CREATED WITH GREAT SUCCESS");
                    },
                    function (error) {
                        console.log("TRIGGER ALREADY EXISTS", error);
                    });
            });

            // Initialize app._accountList and set login screen with default account values
            transaction.executeSql('SELECT * FROM account_list', [],
                function (tx, results) {
                    app._accountList = results;
                    for (let i = 0; i < results.rows.length; i++) {
                        if (results.rows[i].isDefault) {
                            $$("#username-input").addClass("not-empty-state");
                            $$("#login-screen-username").addClass("not-empty-state").val(results.rows[i].user);
                        }
                    }
                    console.log("Tout est good !!!");

                }, function () {
                    console.log("Error : SQLite TABLE account_list");
                }
            );
        });
        console.log("r"+this._userID+"r");
        if (this._userID == '') {
            this.showLogin();
        } else {
            this.disconnect();
        }
    }

    /**
     * Fonction pour faire apparaitre la page login lors de la connexion à l'application
     */
    showLogin() {
        myApp.loginScreen();

        // Récup account_list
        myDB.transaction(function(transaction) {
            transaction.executeSql('SELECT * FROM account_list', [],
                function (tx, results) {
                    app._userList = [];
                    for (let i=0; i<results.rows.length;i++){
                        app._userList[i] = results.rows[i].user;
                        if(results.rows[i].isDefault){
                            $$("#username-input").addClass("not-empty-state");
                            $$("#login-screen-username").addClass("not-empty-state").val(results.rows[i].user);
                        }
                    }
                },function(){
                    console.log("Error : SQLite TABLE account_list DOES NOT EXIST");
                });
        });

        // Corresponding usernames autocomplete
        myApp.autocomplete({
            input: '#login-screen-username',
            openIn: 'dropdown',
            source: function (autocomplete, query, render) {
                var results = [];
                for (var i = 0; i < app._userList.length; i++) {
                    if (app._userList[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(app._userList[i]);
                }
                render(results);
            }
        });

        $$("#user-autocomplete").addClass("not-empty-state");

        $$('#login-screen-signin').on('click', $.proxy(function() {

            let username = $$("#login-screen-username").val();
            let password = $$("#login-screen-password").val();

            if (username == "") {
                myApp.alert("Merci de saisir un mail", "Erreur");
            } else if (password == "") {
                myApp.alert("Merci de saisir un mot de passe", "Erreur");
            } else {
                app.getUser(username, password);
            }

            console.log("5");

        }));

    }


    disconnect() {
        myApp.loginScreen();
        let result = '<div class="login-screen-title i18n">' +
                        '<img class="login-logo" src="img/PGO-square.png" alt="Logo">' +
                     '</div>'+
                     '<a href="#" class="close-login-screen">'+
                        '<i class="f7-icons close-button">close</i>'+
                     '</a>'+
                     '<div class="list-block-label">' +
                        '<p>Bonjour <span class="username">'+this._username+'</span></p></p>'+
                        '<p><a href="#" class="icon-green" id="logout">Se déconnecter</a></p>'+
                    '</div>';
        $$('.login-screen-content').html(result);
        let that = this;

        $$('#logout').on('click', $.proxy(function() {
            that._userID = '';
            that._username = '';
            let result = '<div class="login-screen-title i18n">'+
                        '<img class="login-logo" src="img/PGO-square.png" alt="Logo">'+
                    '</div>'+
                    '<a href="#" class="close-login-screen">'+
                        '<i class="f7-icons close-button">close</i>'+
                    '</a>'+
                    '<form id="login-form">'+
                        '<div class="list-block">'+
                           ' <ul>'+
                               ' <li class="item-content">'+
                                    '<div class="item-content border-green">'+
                                        '<div class="item-inner" id="user-autocomplete">'+
                                            '<div class="item-input">'+
                                               ' <input type="text" placeholder="Votre adresse e-mail" id="login-screen-username">'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</li>'+
                                '<li class="item-content">'+
                                    '<div class="item-content border-green">'+
                                        '<div class="item-inner">'+
                                            '<div class="item-input">'+
                                                '<input type="password" placeholder="Votre mot de passe" id="login-screen-password">'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</li>'+
                            '</ul>'+
                        '</div>'+
                    '</form>'+
                    '<div class="content-block">'+
                        '<div class="list-block">'+
                            '<ul>'+
                                '<li><a href="#" class="login-screen-signin item-link list-button i18n" id="login-screen-signin">Se connecter</a></li>'+
                            '</ul>'+
                            '<div class="list-block-label">'+
                                '<p>Vous n\'\êtes pas encore inscrits ?</p>'+
                                '<p><a href="subscribe.html" class="icon-green">Inscrivez-vous</a></p>'+
                            '</div>'+
                        '</div>'+
                    '</div>';

                    $$('.login-screen-content').html(result);
                    myApp.closeModal();
        }));
    }


    /**
     * Fonction qui appelle notre base de données pour voir si l'utilisateur existe puis si bon résultat sauvegarde
     * l'utilsateur dans la base du téléphone et nous connecte à l'application.
     */
    getUser(email, password) {
        $.ajax({
            url: this._APIServer + "connect_user.php",
            data: {email: email, password: password},
            dataType: "json",
        }).done($.proxy(function(data){

            let res = data;
            console.log('getUser response', res);

            if(data.length != 0) {
                if (email == data[0].mail) {
                    myDB.transaction(function (transaction) {
                        //Try to find duplicate credentials in SQLite database
                        transaction.executeSql('SELECT DISTINCT user FROM account_list', [],
                            function (tx, results) {
                                let double = 0;
                                for (let i = 0; i < results.rows.length; i++) {
                                    if (email == results.rows[i].user) {
                                        double = 1;
                                    }
                                }

                                // Update account list
                                if (!double) {
                                    // Save credentials to SQLite database
                                    myDB.transaction(function (transaction) {
                                        transaction.executeSql('INSERT INTO account_list (id, user, isDefault) VALUES (null, "' + data[0].mail + '", 0)', [],
                                            function (tx, results) {
                                                console.log("Compte ajouté au gestionnaire de comptes.");
                                            }, function () {
                                                console.log("Les identifiants de connexion n'ont pu être sauvegardés.");
                                            });
                                    });

                                    // Update app._accountList
                                    myDB.transaction(function (transaction) {
                                        transaction.executeSql('SELECT * FROM account_list', [],
                                            function (tx, results) {
                                                app._accountList = results;
                                            }, function () {
                                                console.log("Erreur SQLite: Impossible de mettre à jour le gestionnaire de comptes.");
                                            });
                                    });

                                }

                            }, function () {
                                console.log("Erreur SQLite : impossible de récupérer la liste des comptes utilisateurs.");
                            });
                    });

                    // Initialize application
                    myApp.closeModal();
                    this._userID = data[0].id;
                    this._username = data[0].name;
                    console.log(this._userID);
                }
            } else {
                console.log("error log !!");
                myApp.alert("Erreur d'identification !!!");
            }
        }, this)).fail(function( jqXHR, textStatus, errorThrown )  {
            console.log('CALL API USER FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }
    

    /**
     *
     */
    initAccountManager() {
        this._accountManager.init();
    }

    /**
     *
     */
    initSearchStation() {
        this._station.init();
    }

    /**
     *
     */
    initNextTrains(codeStation, nameStation) {
        this._station.initDataTrains(codeStation, nameStation, this._userID);
    }

    /**
     *
     */
    initCloseTo() {
        this._closeTo.init();
    }

    /**
     *
     */
    initResultItinerary(query) {
        this._pathItinerary.initResultItinerary(query.stationFormCode, query.stationToCode);
    }

    /**
     *
     */
    initSearchItinerary() {
        this._pathItinerary.init();
    }

    /**
     *
     */
    initFavoritesStations() {
        this._favorites.init(this._userID);
    }

    /**
     *
     */
    initSubscribe() {
        myApp.closeModal();
        this._subscribe.init();
    }
}
