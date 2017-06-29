/**
 * Created by Julien on 21/06/2017.
 */

class PathItineraryView {

    constructor() {
        console.log("pathItinerary:constructor()");
        this._APINativia = 'https://9a515a8c-7b22-456e-8e0d-6bdddfd9206f@api.navitia.io/v1/coverage/fr-idf/';
        this._Host = 'http://134.157.46.190/';
        this._apiURIstation = 'server/station.php';
        this._apiURIitinerary = 'server/itinerary.php';
        this._date = "";
    }

    init() {
        console.log("pathItinerary:init()");
        console.log();

        this.getRoutePoint();
    }

    /**
     * Fonction pour récuperer les stations que l'on veut pour notre itinéaire
     */
    getRoutePoint() {
        $.ajax({
            url: this._Host + this._apiURIstation,
            dataType: "json",
            success: function (data) {
                var StationSearchBar = [];

                console.log('getAPIstation response', data);
                console.log(data[0].name);

                for (var i = 0; i < data.length; i++) {
                    StationSearchBar.push(data[i].name);
                }

                // autocomplete pour le départ d'une station
                myApp.autocomplete({
                    input: '#station-from',
                    openIn: 'dropdown',
                    autoFocus: true,
                    source: function (autocomplete, query, render) {
                        var results = [];
                        if (query.length === 0) {
                            render(results);
                            return;
                        }
                        // Find matched items
                        for (var i = 0; i < StationSearchBar.length; i++) {
                            if (StationSearchBar[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(StationSearchBar[i]);
                        }
                        // Render items by passing array with result items
                        render(results);
                    }
                });

                //autocomplete pour l'arrivée à une station
                myApp.autocomplete({
                    input: '#station-to',
                    openIn: 'dropdown',
                    autoFocus: true,
                    source: function (autocomplete, query, render) {
                        var results = [];
                        if (query.length === 0) {
                            render(results);
                            return;
                        }
                        // Find matched items
                        for (var i = 0; i < StationSearchBar.length; i++) {
                            if (StationSearchBar[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(StationSearchBar[i]);
                        }
                        // Render items by passing array with result items
                        render(results);
                    }
                });
            }
        });
        $$('#searchItinerary-go').on('click', $.proxy(function () {
            var stationFormCode = "";
            var stationToCode = "";

            let stationFrom = $$("#station-from").val();
            let stationTo = $$("#station-to").val();

            // Récupération du stop-area pour la station de départ
            $.ajax({
                url: this._Host + this._apiURIitinerary,
                data: {station: stationFrom},
                success: function (data) {
                    console.log('getAPIitinerary response', data);
                    stationFormCode = data;
                }
            });

            // Récupération du stop-area pour la station d'arrivée
            $.ajax({
                url: this._Host + this._apiURIitinerary,
                data: {station: stationTo},
                success: function (data) {
                    console.log('getAPIitinerary response', data);
                    stationToCode = data;

                    setTimeout(function () {
                        mainView.router.load({
                            url: 'pathItinerary.html',
                            query: {
                                stationFormCode,
                                stationToCode,
                                stationFrom,
                                stationTo
                            }
                        })
                    }, 500);
                }
            });

        }, this)).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('Ajax from codeStation', jqXHR, textStatus, errorThrown);
        });
    }


    /**
     * Fonction pour récupérer la date à l'instant même dans le format que comprend l'API navitia
     * @returns {string}
     */
    getDate() {
        var str = new Date();
        var year = str.getFullYear().toString();
        var month = str.getMonth() + 1;
        if (month < 10)
            var realMonth = "0" + month.toString();
        else
            var realMonth = month.toString();
        var day = str.getDate();
        if (day < 10)
            var realDay = "0" + day.toString();
        else
            var realDay = day.toString();
        var hours = str.getHours();
        if (hours < 10)
            var realHours = "0" + hours.toString();
        else
            var realHours = hours.toString();
        var minutes = str.getMinutes();
        if (minutes < 10)
            var realMinutes = "0" + minutes.toString();
        else
            var realMinutes = minutes.toString();
        var seconds = str.getSeconds();
        if (seconds < 10)
            var realSeconds = "0" + seconds.toString();
        else
            var realSeconds = seconds.toString();
        return year + realMonth + realDay + "T" + realHours + realMinutes + realSeconds + "&";
    }

    /**
     * Init de la page concernant le résultat pour l'itinéraire
     * @param codeStationFrom
     * @param codeStationTo
     */
    initResultItinerary(codeStationFrom, codeStationTo, stationFrom, stationTo) {
        console.log("initResultItinerary:::" + codeStationFrom + "," + codeStationTo);
        this._date = this.getDate();

        let itineraire = stationFrom + " - " + stationTo;
        $$("#trajet-title").html(itineraire);


        this.callAPIItineraire(codeStationFrom, codeStationTo, this._date);
    }

    /**
     * Fonction qui appelle l'API navitia pour itinéraire d'un parcours demandé + mise en page des résultats
     * @param codeStationFrom
     * @param codeStationTo
     * @param dateTime
     */
    callAPIItineraire(codeStationFrom, codeStationTo, dateTime) {
        console.log(codeStationFrom + "    " + codeStationTo);
        $.ajax({
            url: this._APINativia + "journeys?from=stop_area%3AOIF%3ASA%3A" + codeStationFrom + "&to=stop_area%3AOIF%3ASA%3A" + codeStationTo + "&datetime=" + dateTime,
        }).done($.proxy(function (data) {
            var itemStationSearchBar = "";
            var idAccordion = "";
            var liAccordion = "";
            var tabJourneys = [];
            var tabIti = [];

            let res = data;
            console.log('getAPIitinearaire response', res);
            console.log(data.journeys.length);

            var best = 0;
            var rapid = 0;
            var comfort = 0;
            var fastest = 0;

            //boucle for

            for (var i = 0; i < data.journeys.length; i++) {
                itemStationSearchBar = "";
                idAccordion = "";
                var temps = data.journeys[i].arrival_date_time.split("T");
                var tempsComplet = temps[1];
                var hour = tempsComplet.slice(0, 2);
                var min = tempsComplet.slice(2, 4);
                var arrive = hour + ":" + min;

                console.log("debut for i");
                if ((data.journeys[i].type == "rapid" && rapid < 1) || (data.journeys[i].type == "best" && best < 1) || (data.journeys[i].type == "comfort" && comfort < 1) || (data.journeys[i].type == "fastest" && rapid < 1)) {
                    console.log("premier if");
                    liAccordion += '<li class="accordion-item">' +
                        '<a href="#" class="item-content item-link">' +
                        '<div class="item-inner">';


                    if (data.journeys[i].type == "best") {
                        liAccordion += '<div class="item-title">Le meilleur trajet</div>';
                        console.log("2eme if");
                        best++;
                    }
                    else if (data.journeys[i].type == "rapid") {
                        liAccordion += '<div class="item-title">Le meilleur compromis</div>';
                        rapid++;
                    }
                    else if (data.journeys[i].type == "comfort") {
                        liAccordion += '<div class="item-title">Le moins de correspondances</div>';
                        comfort++;
                    }
                    else if (data.journeys[i].type == "fastest") {
                        liAccordion += '<div class="item-title">Le plus rapide</div>';
                        fastest++;
                    }

                    liAccordion += '<div class="item-details">' +
                        '<div>' +
                        '<i class="material-icons">timer</i>' +
                        '<div class="details-nb">' + Math.round(data.journeys[i].duration / 60) + ' min</div>' +
                        '</div>' +
                        '<div>' +
                        '<i class="material-icons">directions_walk</i>' +
                        '<div class="details-nb">' + Math.round(data.journeys[i].durations.walking / 60) + ' min</div>' +
                        '</div>' +
                        '<div>' +
                        '<i class="material-icons">swap_calls</i>' +
                        '<div class="details-nb">' + data.journeys[i].nb_transfers + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</a>' +
                        '<div class="accordion-item-content content-block" id="accordion-' + data.journeys[i].type + '">' +
                        '</div>' +
                        '</li>';

                    //Chaque étape
                    for (var j = 0; j < data.journeys[i].sections.length; j++) {
                        var time = data.journeys[i].sections[j].departure_date_time.split("T");
                        var fullTime = time[1];
                        var h = fullTime.slice(0, 2);
                        var m = fullTime.slice(2, 4);
                        var heure = h + ":" + m;

                        if (j == 0 && (data.journeys[i].sections[j].type == "transfer" || data.journeys[i].sections[j].type == "waiting" || data.journeys[i].sections[j].type == "crow_fly" || data.journeys[i].sections[j].type == "street_network")) {
                            if (data.journeys[i].sections[j].duration == 0 && data.journeys[i].sections[j].to.name == data.journeys[i].sections[j].from.name) {
                                if ((j + 1) != data.journeys[i].sections.length - 1) {
                                    itemStationSearchBar += '<div class="step">' +
                                        '<div class="time">' + heure +
                                        '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt="">' + '</div>';

                                    if ((j + 2) == data.journeys[i].sections.length - 1) {
                                        if ((data.journeys[i].sections[j + 2].type == "transfer" || data.journeys[i].sections[j + 2].type == "waiting" || data.journeys[i].sections[j + 2].type == "crow_fly" || data.journeys[i].sections[j + 2].type == "street_network") && data.journeys[i].sections[j + 2].duration == 0 /*data.journeys[i].sections[j + 2].from.name == data.journeys[i].sections[j + 2].to.name*/) {
                                            itemStationSearchBar += '<div class="end-time">' + arrive +
                                                '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt=""></div>' +
                                                '</div>';
                                        }
                                    }

                                    itemStationSearchBar += '</div>' +
                                        '<div class="ligne ligne' + data.journeys[i].sections[1].display_informations.code + '"></div>' +
                                        '<div class="stations">' +
                                        '<div class="start">' + data.journeys[i].sections[1].from.stop_point.name + '</div>' +
                                        '<div class="start-direction">' +
                                        '<span class="metro ligne' + data.journeys[i].sections[1].display_informations.code + '">Ligne ' + data.journeys[i].sections[1].display_informations.code + '</span>' +
                                        '<i class="f7-icons">chevron-right</i>' +
                                        data.journeys[i].sections[1].display_informations.direction.substring(0, data.journeys[i].sections[1].display_informations.direction.indexOf("(")) +
                                        '</div>' +
                                        '<div class="transport-mode">' +
                                        '<i class="fa fa-bus" aria-hidden="true"></i>' +
                                        Math.round(data.journeys[i].sections[1].duration / 60) + ' min' +
                                        '</div>';

                                    if ((j + 2) == data.journeys[i].sections.length - 1) {
                                        if ((data.journeys[i].sections[j + 2].type == "transfer" || data.journeys[i].sections[j + 2].type == "waiting" || data.journeys[i].sections[j + 2].type == "crow_fly" || data.journeys[i].sections[j + 2].type == "street_network") && data.journeys[i].sections[j + 2].duration == 0 /*data.journeys[i].sections[j + 2].from.name == data.journeys[i].sections[j + 2].to.name*/) {
                                            itemStationSearchBar += '<div class="end">' + data.journeys[i].sections[1].to.stop_point.name + '</div>';
                                        }
                                    }

                                    itemStationSearchBar += '</div>' +
                                        '</div>';
                                    j++;
                                }
                                else {
                                    itemStationSearchBar += '<div class="step">' +
                                        '<div class="time">' + heure +
                                        '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt="">' + '</div>' +
                                        '<div class="end-time">' + arrive +
                                        '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt=""></div>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="ligne ligne' + data.journeys[i].sections[1].display_informations.code + '"></div>' +
                                        '<div class="stations">' +
                                        '<div class="start">' + data.journeys[i].sections[1].from.stop_point.name + '</div>' +
                                        '<div class="start-direction">' +
                                        '<span class="metro ligne' + data.journeys[i].sections[1].display_informations.code + '">Ligne ' + data.journeys[i].sections[1].display_informations.code + '</span>' +
                                        '<i class="f7-icons">chevron-right</i>' +
                                        data.journeys[i].sections[1].display_informations.direction.substring(0, data.journeys[i].sections[1].display_informations.direction.indexOf("(")) +
                                        '</div>' +
                                        '<div class="transport-mode">' +
                                        '<i class="fa fa-bus" aria-hidden="true"></i>' +
                                        Math.round(data.journeys[i].sections[1].duration / 60) + ' min' +
                                        '</div>' +
                                        '<div class="end">' + data.journeys[i].sections[1].to.stop_point.name + '</div>' +
                                        '</div>' +
                                        '</div>';
                                    j++;
                                }
                            }
                            else if (data.journeys[i].sections[j].to.name != data.journeys[i].sections[j].from.name) {
                                itemStationSearchBar += '<div class="step walk">' +
                                    '<div class="time">' + heure +
                                    '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt=""></div>' +
                                    '</div>' +
                                    '<div class="ligne"></div>' +
                                    '<div class="stations">' +
                                    '<div class="start">' + data.journeys[i].sections[0].from.stop_area.name + '</div>' +
                                    '<div class="transport-mode">' +
                                    '<i class="material-icons">directions_walk</i>' +
                                    Math.round(data.journeys[i].sections[0].duration / 60) + ' min' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';

                            } else {
                                itemStationSearchBar += '<div class="step walk">' +
                                    '<div class="time">' + heure +
                                    '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt=""></div>' +
                                    '</div>' +
                                    '<div class="ligne"></div>' +
                                    '<div class="stations">' +
                                    '<div class="start">' + data.journeys[i].sections[0].from.name + '</div>' +
                                    '<div class="transport-mode">' +
                                    '<i class="material-icons">directions_walk</i>' +
                                    Math.round(data.journeys[i].sections[j].duration / 60) +
                                    ' min' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                            }
                        }
                        else if (j == 0 && data.journeys[i].sections[j].type == "public_transport") {
                            itemStationSearchBar += '<div class="step">' +
                                '<div class="time">' + heure +
                                '<div class="now">' +
                                '<img src="img/icons/mobile-phone-with-wifi.svg" alt="">' +
                                '</div>' +
                                '</div>' +
                                '<div class="ligne ligne' + data.journeys[i].sections[0].display_informations.code + '"></div>' +
                                '<div class="stations">' +
                                '<div class="start">' + data.journeys[i].sections[0].from.stop_point.name + '</div>' +
                                '<div class="start-direction">' +
                                '<span class="metro ligne' + data.journeys[i].sections[0].display_informations.code + '">Ligne ' + data.journeys[i].sections[0].display_informations.code + '</span>' +
                                '<i class="f7-icons">chevron-right</i>' +
                                data.journeys[i].sections[0].display_informations.direction.substring(0, data.journeys[i].sections[0].display_informations.direction.indexOf("(")) +
                                '</div>' +
                                '<div class="transport-mode">' +
                                '<i class="fa fa-bus" aria-hidden="true"></i>' +
                                Math.round(data.journeys[i].sections[0].duration / 60) + ' min' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                        }
                        else if (data.journeys[i].sections[j].stop_date_times !== undefined && j != data.journeys[i].sections.length - 1) {

                            if ((j + 1) != data.journeys[i].sections.length - 1) {
                                itemStationSearchBar += '<div class="step">' +
                                    '<div class="time">' + heure +
                                    '<div class="now">' +
                                    '<img src="img/icons/mobile-phone-with-wifi.svg" alt="">' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="ligne ligne' + data.journeys[i].sections[j].display_informations.code + '"></div>' +
                                    '<div class="stations">' +
                                    '<div class="start">' + data.journeys[i].sections[j].from.stop_point.name + '</div>' +
                                    '<div class="start-direction">' +
                                    '<span class="metro ligne' + data.journeys[i].sections[j].display_informations.code + '">Ligne ' + data.journeys[i].sections[j].display_informations.code + '</span>' +
                                    '<i class="f7-icons">chevron-right</i>' +
                                    data.journeys[i].sections[j].display_informations.direction.substring(0, data.journeys[i].sections[j].display_informations.direction.indexOf("(")) +
                                    '</div>' +
                                    '<div class="transport-mode">' +
                                    '<i class="fa fa-bus" aria-hidden="true"></i>' +
                                    Math.round(data.journeys[i].sections[j].duration / 60) +
                                    ' min' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                            }
                            else if ((data.journeys[i].sections[j + 1].type == "transfer" || data.journeys[i].sections[j + 1].type == "waiting" || data.journeys[i].sections[j + 1].type == "crow_fly" || data.journeys[i].sections[j + 1].type == "street_network") && data.journeys[i].sections[j + 1].from.name == data.journeys[i].sections[j + 1].to.name) {
                                itemStationSearchBar += '<div class="step">' +
                                    '<div class="time">' + heure +
                                    '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt=""></div>' +
                                    '<div class="end-time">' + arrive +
                                    '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt=""></div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="ligne ligne' + data.journeys[i].sections[j].display_informations.code + '"></div>' +
                                    '<div class="stations">' +
                                    '<div class="start">' + data.journeys[i].sections[j].from.stop_point.name + '</div>' +
                                    '<div class="start-direction">' +
                                    '<span class="metro ligne' + data.journeys[i].sections[j].display_informations.code + '">Ligne ' + data.journeys[i].sections[j].display_informations.code + '</span>' +
                                    '<i class="f7-icons">chevron-right</i>' +
                                    data.journeys[i].sections[j].display_informations.direction.substring(0, data.journeys[i].sections[j].display_informations.direction.indexOf("(")) +
                                    '</div>' +
                                    '<div class="transport-mode">' +
                                    '<i class="fa fa-bus" aria-hidden="true"></i>' +
                                    Math.round(data.journeys[i].sections[j].duration / 60) +
                                    ' min' +
                                    '</div>' +
                                    '<div class="end">' + data.journeys[i].sections[j].to.stop_point.name + '</div>' +
                                    '</div>' +
                                    '</div>';
                                j += 2;
                            } else if (data.journeys[i].sections[j + 1].duration != 0) {
                                itemStationSearchBar += '<div class="step">' +
                                    '<div class="time">' + heure +
                                    '<div class="now">' +
                                    '<img src="img/icons/mobile-phone-with-wifi.svg" alt="">' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="ligne ligne' + data.journeys[i].sections[j].display_informations.code + '"></div>' +
                                    '<div class="stations">' +
                                    '<div class="start">' + data.journeys[i].sections[j].from.stop_point.name + '</div>' +
                                    '<div class="start-direction">' +
                                    '<span class="metro ligne' + data.journeys[i].sections[j].display_informations.code + '">Ligne ' + data.journeys[i].sections[j].display_informations.code + '</span>' +
                                    '<i class="f7-icons">chevron-right</i>' +
                                    data.journeys[i].sections[j].display_informations.direction.substring(0, data.journeys[i].sections[j].display_informations.direction.indexOf("(")) +
                                    '</div>' +
                                    '<div class="transport-mode">' +
                                    '<i class="fa fa-bus" aria-hidden="true"></i>' +
                                    Math.round(data.journeys[i].sections[j].duration / 60) +
                                    ' min' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                                itemStationSearchBar += '<div class="step walk">' +
                                    '<div class="time">' + heure +
                                    '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt=""></div>' +
                                    '<div class="end-time">' + arrive +
                                    '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt=""></div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="ligne"></div>' +
                                    '<div class="stations">' +
                                    '<div class="start">' + data.journeys[i].sections[j + 1].from.name + '</div>' +
                                    '<div class="transport-mode">' +
                                    '<i class="material-icons">directions_walk</i>' +
                                    Math.round(data.journeys[i].sections[j + 1].duration / 60) +
                                    ' min' +
                                    '</div>' +
                                    '<div class="end">' + data.journeys[i].sections[j + 1].to.stop_area.name + '</div>' +
                                    '</div>' +
                                    '</div>';

                                j += 2;
                            } else {
                                itemStationSearchBar += '<div class="step">' +
                                    '<div class="time">' + heure +
                                    '<div class="now">' +
                                    '<img src="img/icons/mobile-phone-with-wifi.svg" alt="">' +
                                    '</div>' +
                                    '<div class="end-time">' + arrive +
                                    '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt=""></div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="ligne ligne' + data.journeys[i].sections[j].display_informations.code + '"></div>' +
                                    '<div class="stations">' +
                                    '<div class="start">' + data.journeys[i].sections[j].from.stop_point.name + '</div>' +
                                    '<div class="start-direction">' +
                                    '<span class="metro ligne' + data.journeys[i].sections[j].display_informations.code + '">Ligne ' + data.journeys[i].sections[j].display_informations.code + '</span>' +
                                    '<i class="f7-icons">chevron-right</i>' +
                                    data.journeys[i].sections[j].display_informations.direction.substring(0, data.journeys[i].sections[j].display_informations.direction.indexOf("(")) +
                                    '</div>' +
                                    '<div class="transport-mode">' +
                                    '<i class="fa fa-bus" aria-hidden="true"></i>' +
                                    Math.round(data.journeys[i].sections[j].duration / 60) +
                                    ' min' +
                                    '</div>' +
                                    '<div class="end">' + data.journeys[i].sections[j].to.stop_point.name + '</div>' +
                                    '</div>' +
                                    '</div>';
                                j += 2;
                            }

                        }
                        else {
                            if (data.journeys[i].sections[j].duration !== 0) {
                                if (data.journeys[i].sections[j].type == "transfer" || data.journeys[i].sections[j].type == "waiting") {
                                    if (data.journeys[i].sections[j].type == "transfer") {
                                        itemStationSearchBar += '<div class="step walk">' +
                                            '<div class="time">' + heure +
                                            '<div class="now"><img src="img/icons/mobile-phone-with-wifi.svg" alt=""></div>' +
                                            '</div>' +
                                            '<div class="ligne"></div>' +
                                            '<div class="stations">' +
                                            '<div class="start">' + data.journeys[i].sections[j].from.stop_point.name + '</div>' +
                                            '<div class="transport-mode">' +
                                            '<i class="material-icons">directions_walk</i>' +
                                            Math.round(data.journeys[i].sections[j].duration / 60) +
                                            ' min' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>';
                                    }
                                    if (data.journeys[i].sections[j].type == "waiting") {
                                        //itemStationSearchBar += '<p>J\'attends pendant '+data.journeys[i].sections[j].duration+ ' secondes.</p>';
                                    }
                                } else {
                                    //itemStationSearchBar += '<p>Je pars de '+ data.journeys[i].sections[j].from.name +' en direction de  ' + data.journeys[i].sections[j].to.name + ' à '+ heure+ '</p>';
                                }
                            }
                        }
                    }

                    idAccordion += '#accordion-' + data.journeys[i].type;
                    tabJourneys.push(idAccordion);
                    tabIti.push(itemStationSearchBar);

                }
            }
            $$("#list-itineraries").html(liAccordion);

            for (i = 0; i < data.journeys.length; i++) {
                $$(tabJourneys[i]).html(tabIti[i]);
            }
        }, this)).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('CALL API ITINERAIRE FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }
}