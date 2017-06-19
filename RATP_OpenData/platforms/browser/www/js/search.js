// Created on June 19th by Laurent

class SearchView {

    constructor() {
        console.log("=============== Test::constructor() ========== ");
    }

    init(server) {
        console.log("=============== Test::init() ========== ");
        console.log(server);

        this.dataAPICloseTo("2.37768;48.85334");
        this.dataAPIStation("%3AOIF%3ASA%3A59300","20170615T164106&");
        this.dataAPIItineraire("%3AOIF%3ASA%3A59300","%3AOIF%3ASA%3A59522","20170615T164106&")

    }

}