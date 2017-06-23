// Created on June 19th by Laurent

class StationView {

    constructor() {
        console.log("searchStation:constructor()");
        this._APINativia = 'https://9a515a8c-7b22-456e-8e0d-6bdddfd9206f@api.navitia.io/v1/coverage/fr-idf/';
        this._distance = "50";
        this._Host = 'http://localhost/';
        this._apiURIstation = 'server/station.php';
        var str = new Date();
        var year = str.getFullYear().toString();
        var month = str.getMonth() + 1;
        if(month<10)
            var realMonth = "0" + month.toString();
        else
            var realMonth = month.toString();
        var day = str.getDate();
        if(day<10)
            var realDay = "0" + day.toString();
        else
            var realDay = day.toString();
        var hours = str.getHours();
        if(hours<10)
            var realHours = "0" + hours.toString();
        else
            var realHours = hours.toString();
        var minutes = str.getMinutes();
        if(minutes<10)
            var realMinutes = "0" + minutes.toString();
        else
            var realMinutes = minutes.toString();
        var seconds = str.getSeconds();
        if(seconds<10)
            var realSeconds = "0" + seconds.toString();
        else
            var realSeconds = seconds.toString();
        this._dateAPI = year + realMonth + realDay + "T" + realHours + realMinutes + realSeconds + "&";
    }

    init() {
        console.log("Station::init()");

        this.getStation();

    }

    /**
     * Fonction qui appelle notre base de données et récupére tous les noms de stations ainsi que leurs codes et coordonnées.
     */
    getStation() {
        $.ajax({
            url: this._Host + this._apiURIstation,
            dataType : "json",
            success : function(data)
            {
                var itemStationSearchBar = "";

                console.log('getAPIstation response', data);
                console.log(data[0].name);
                
                for (var i = 0; i < data.length; i++) {
                        itemStationSearchBar += '<li class="item-content">' +
                                                    '<div class="item-inner">' +
                                                        '<a href="nextTrains.html?codeStation='+data[i].stop_area+'='+data[i].name+'">' +
                                                            '<div class="item-title">'+data[i].name+'</div>' +
                                                        '</a>' +
                                                    '</div>' +
                                                '</li>';
                }
               $$('#list-items-stations').html(itemStationSearchBar);

                //test.callAPIStation(data[0].stop_area,"20170615T164106&");
            }
        });
    }

    /**
     * Fonction d'init de la page html nextTrains
     * @param codeStation
     * @param nameStation
     */
    initDataTrains(codeStation, nameStation) {
        console.log("nextTrains:Init()")
        console.log(codeStation);
        console.log(nameStation);
        console.log(this._dateAPI);

        this.callAPIStation(codeStation, this._dateAPI, nameStation);
    }


    /**
     * Fonction qui appelle l'API navitia pour récupérer les passages des prochains transports à un point donné
     * @param codeStation
     * @param dateTime
     */
    callAPIStation(codeStation, dateTime, nameStation) {
        var result = "";

        $.ajax({
            url: this._APINativia + "stop_areas/stop_area%3AOIF%3ASA%3A"+codeStation+"/departures?from_datetime="+dateTime+"count=100&",
        }).done($.proxy(function(data){

            let res = data;

            console.log('getAPIstation response', res);

            // Tableau contenant le nombre d'affichage de chaque métro, 1 case par métro (de 1 à 16, 0 est vide, 15 et 16 correspondent au métro 3B et 7B)
/*
            var metroCount = [][];
            for(var j = 0; j <= 14; j++) {
                metroCount[j] = 0;
                for(var k = 0; k <= 2; k++) {
                    metroCount[j][k] = 0;
                }
            }
*/

            var metroTab = {};
            var affTab = {};
            // Boucle pour récup les infos des stations
            for (var i = 0; i < data.departures.length; i++) {
                if("Métro".localeCompare(data.departures[i].display_informations.commercial_mode)==0) {
                    // Cette chaîne concatène la ligne du métro et sa direction
                    var strFullInfo = data.departures[i].display_informations.code + data.departures[i].display_informations.direction;
                    if(metroTab.hasOwnProperty(strFullInfo)) {
                        //var tmp = parseInt(data.departures[i].display_informations.code);
                        if(metroTab[strFullInfo]<2) {
                            // On récupère la date d'arrivée du prochain transport
                            var tmpTime = data.departures[i].stop_date_time.arrival_date_time;
                            // On sépare la date en 2 pour enlever le "T"
                            var newTime = tmpTime.split("T");
                            var newNow = dateTime.split("T");
                            // On refusionne la date
                            var newStopTime = newTime.join("");
                            var newNowTime = newNow.join("");
                            // On reconvertit la date d'arrivée du prochain transport et l'heure actuelle au format date
                            var nextTrain = new Date(newStopTime.slice(0,4),newStopTime.slice(4,6),newStopTime.slice(6,8),newStopTime.slice(8,10),newStopTime.slice(10,12),newStopTime.slice(12,14));
                            var timeNow = new Date(newNowTime.slice(0,4),newNowTime.slice(4,6),newNowTime.slice(6,8),newNowTime.slice(8,10),newNowTime.slice(10,12),newNowTime.slice(12,14));
                            // On calcule le temps d'attente
                            var arrivalTime = nextTrain.getTime() - timeNow.getTime();
                            arrivalTime = arrivalTime / 60000;
                            arrivalTime = Math.round(arrivalTime);
                            affTab[strFullInfo] += '<p>' + 'Arrêt actuel : ' + data.departures[i].stop_point.label + ', Métro n°' + data.departures[i].display_informations.code +
                            ' à destination de ' + data.departures[i].display_informations.direction + ', le prochain est dans ' + arrivalTime + ' min' + '</p></br>';
                            metroTab[strFullInfo]++;
                        }
                    }
                    else {
                        metroTab[strFullInfo] = 0;
                        affTab[strFullInfo] = "";
                        // On récupère la date d'arrivée du prochain transport
                        var tmpTime = data.departures[i].stop_date_time.arrival_date_time;
                        // On sépare la date en 2 pour enlever le "T"
                        var newTime = tmpTime.split("T");
                        var newNow = dateTime.split("T");
                        // On refusionne la date
                        var newStopTime = newTime.join("");
                        var newNowTime = newNow.join("");
                        // On reconvertit la date d'arrivée du prochain transport et l'heure actuelle au format date
                        var nextTrain = new Date(newStopTime.slice(0,4),newStopTime.slice(4,6),newStopTime.slice(6,8),newStopTime.slice(8,10),newStopTime.slice(10,12),newStopTime.slice(12,14));
                        var timeNow = new Date(newNowTime.slice(0,4),newNowTime.slice(4,6),newNowTime.slice(6,8),newNowTime.slice(8,10),newNowTime.slice(10,12),newNowTime.slice(12,14));
                        // On calcule le temps d'attente
                        var arrivalTime = nextTrain.getTime() - timeNow.getTime();
                        arrivalTime = arrivalTime / 60000;
                        arrivalTime = Math.round(arrivalTime);
                        affTab[strFullInfo] += '<p>' + 'Arrêt actuel : ' + data.departures[i].stop_point.label + ', Métro n°' + data.departures[i].display_informations.code +
                        ' à destination de ' + data.departures[i].display_informations.direction + ', le prochain est dans ' + arrivalTime + ' min' + '</p></br>';
                        metroTab[strFullInfo]++;
                    }
                }
            }
            console.log(metroTab);

            var newTab = [];

            for(var affichage in affTab) {
                newTab.push(affichage);
                //result += affTab[affichage];
            }

            newTab.sort();

            for(var k = 0;k < newTab.length; k++) {
                result += affTab[newTab[k]];
            }

            console.log(newTab);
            

            $$('#next-station-page-content').html(result);

        }, this)).fail(function( jqXHR, textStatus, errorThrown )  {
            console.log('CALL API STATION FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }
}