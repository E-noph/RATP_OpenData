/**
 * Created by Julien on 13/06/2017.
 */

class TestView {

    constructor() {
        console.log("=============== Test::constructor() ========== ");
    }

    init(server) {
        console.log("=============== Test::init() ========== ");
        console.log(server);

        this.testAPIdistance("2.37768;48.85334","50");
    }

    testAPIdistance(coords,distance) {
        app.callAPIdistance(coords,distance, $.proxy(function(data) {
            if (data.error) {
                console.log('testAPI ERROR', data);
            }
            else {
                console.log('testAPI response', data);
            }
        }, this));
    }

}