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

        // views
        this._test = new TestView();
        this._next-trains = new NextTrainsView();
        this._search = new SearchView();
        this._search2 = new Search2();

        console.log("++++++++++", this._serverPhonegap);

    }

    /**
     * Fonction qui appelle notre base de données pour voir si l'utilisateur existe.
     */
    getUser(email) {
        $.ajax({
            url: "http://localhost/server/connect_user.php",
            data: 'email='+ email,
            success : function(data)
            {
                console.log('getAPIconnectUser response', data);
            }
        });
    }

    /**
     *
     */
    initTest() {
        this._test.init();
    }


}
