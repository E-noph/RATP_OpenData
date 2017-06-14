var app = null;

// Initialize app
var myApp = new Framework7({
    debug: true,
    swipePanel: 'right',
    swipePanelThreshold: 5,
    smartSelectOpenIn:'picker',
});
myApp.debug = true;


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");

    app = new Application();
    console.log("APP !!",app);

});

// Now we need to run the code that will be executed only for About page.

$$(document).on('pageInit', function (e) {
    var page = e.detail.page;

    if (page.name === 'test') {
        console.log("je passe par la !!!")
        app.initTest();
    }
});