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

        // powered by the server
        this._Host = 'http://134.157.46.190:3000/';

        // views
        this._test = new TestView();

        console.log("++++++++++", this._serverPhonegap);

    }

    /**
     *
     */
    initTest() {
        this._test.init();
    }


}
