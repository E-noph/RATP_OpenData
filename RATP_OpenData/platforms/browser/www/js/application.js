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

        // views
        this._test = new TestView();

        console.log("++++++++++", this._serverPhonegap);

    }

    /**
     * Fonction qui appelle notre base de données pour voir si l'utilisateur existe.
     */
    getUser(email, password) {
        $.ajax({
            url: "http://localhost/server/connect_user.php",
            data: {email: email, password: password},
            dataType : "json",
            success : function(data)
            {
                console.log('getAPIconnectUser response', data);

                if (data[0].mail == "") {
                    myApp.alert("Erreur d'identification, si vous avez pas de compte merci de vous inscrire", function () {
                        mainView.goBack();
                    });
                } else if (email == data[0].mail) {
                    myApp.closeModal();
                }
            }
        });
    }

    /**
     * Fonction qui appelle l'API navitia pour récupérer les passages des prochains transports à un point donné
     * @param codeStation
     * @param dateTime
     */
    callAPIStation(codeStation, dateTime) {
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

            $$('#test-page-content').html(result);

        }, this)).fail(function( jqXHR, textStatus, errorThrown )  {
            console.log('CALL API STATION FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }

    /**
     *
     */
    initTest() {
        this._test.init();
    }


}
