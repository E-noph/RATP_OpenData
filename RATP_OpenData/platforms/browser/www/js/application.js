/**
 * Created by Julien on 13/06/2017.
 */
"use strict";

class Application {
    /**
     *
     */
    constructor() {
        // should comes from internal config
        this._port = '443';
        this._serverPhonegap = location.href.split(':')[1].substr(2);

        // powered by the server
        this._Host = 'http://134.157.46.190:3000/';

        // views
        this._test = new TestView();

        console.log("++++++++++", this._serverPhonegap);

    }

    /**
     * Get this._apiURI facades and their methods
     */
    callAPIdistance(coords,distance) {
        $.ajax({
            url: "https://9a515a8c-7b22-456e-8e0d-6bdddfd9206f@api.navitia.io/v1/coverage/fr-idf/coords/"+coords+"/lines?distance="+distance,
        }).done($.proxy(function(data){
            // Called service must set "Content-type: application/json"
            //let res = JSON.parse(data);
            let res = data;
            console.log('getAPI response', res);

        }, this)).fail(function( jqXHR, textStatus, errorThrown )  {
            console.log('CALL API FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }

    /**
     *
     */
    initTest() {
        this._test.init();
    }


}
