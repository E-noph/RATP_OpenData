var app = null, test = null, favStation= null, closeTo = null, subscribe=null, myDB = null;

/*var isAndroid = true;//Framework7.prototype.device.android === true;
var isIos = false;//Framework7.prototype.device.ios === true;
console.log('isAndroid: '+isAndroid);
console.log('isIos: '+isIos);

var $$ = Dom7;

if (isAndroid) {
    // Change class
    $$('.view .navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    //$$('.view .navbar').prependTo('.view .page');
}*/

// Initialize app
var myApp = new Framework7({
    debug: true,
    swipePanelThreshold: 5,
    smartSelectOpenIn:'picker',
});
myApp.debug = true;

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Initialize SQLite database for local account storage
myDB = openDatabase('localAccountDB', '1.0', 'localAccountDB', 655367);

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    console.log("navigator.geolocation works well");

    app = new Application();
    favStation = new FavoritesStationsView();
    closeTo = new CloseToView();
    subscribe = new SubscribeView();
    console.log("APP !!",app);
});

$$('#connect-user').on('click', $.proxy(function() {
    app.getAPI();
}));

// Déclaration des pages
$$(document).on('pageInit', function (e) {
    var page = e.detail.page;

    if (page.name === 'test') {
        app.initTest();
    } else if (page.name === 'account') {
        app.initAccountManager();
    } else if (page.name === 'searchStation') {
        app.initSearchStation();
    } else if (page.name === 'nextTrains') {
        app.initNextTrains(page.url.split('=')[1],page.url.split('=')[2]);
    } else if (page.name === 'closeTo') {
        app.initCloseTo();
    } else if (page.name === 'pathItinerary') {
        app.initResultItinerary(page.query);
    } else if (page.name === 'favorites') {
        app.initFavoritesStations();
    } else if (page.name === 'searchItinerary') {
        app.initSearchItinerary();
    } else if (page.name === 'subscribe') {
        app.initSubscribe();
    }
});