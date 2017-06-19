var app = null;

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

$$('.login-screen-signin').on('click', $.proxy(function() {
    let username = $$("#login-screen-username").val();
    let password = $$("#login-screen-password").val();
    console.log(username);
    app.getUser();
}));

$$(document).on('pageInit', function (e) {
    var page = e.detail.page;

    if (page.name === 'test') {
        app.initTest();
    }
});