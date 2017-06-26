/**
 * Created by Julien on 21/06/2017.
 */

class PathItineraryView {

    constructor() {
        console.log("pathItinerary:constructor()");
        this._APINativia = 'https://9a515a8c-7b22-456e-8e0d-6bdddfd9206f@api.navitia.io/v1/coverage/fr-idf/';
    }

    init() {
        console.log("pathItinerary:init()");
        console.log();

        this.callAPIItineraire("%3AOIF%3ASA%3A8738400","%3AOIF%3ASA%3A59300","20170623T093135");

    }

    /**
     * Fonction qui appelle l'API navitia pour itinéraire d'un parcours demandé
     * @param codeStationFrom
     * @param codeStationTo
     * @param dateTime
     */
    callAPIItineraire(codeStationFrom, codeStationTo, dateTime) {
        $.ajax({
            url: this._APINativia + "journeys?from=stop_area"+codeStationFrom+"&to=stop_area"+codeStationTo+"&datetime="+dateTime,
        }).done($.proxy(function(data){
            var itemStationSearchBar = "";

            let res = data;
            console.log('getAPIitinearaire response', res);
            console.log(data.journeys.length);
            //boucle for

            for (var i = 0; i < data.journeys.length; i++) {
                if(data.journeys[i].type == 'best')
                {
                    itemStationSearchBar += "<p><B><U>Trajet recommandé : </U></B></p>"
                }
                if(data.journeys[i].type == 'fastest')
                {
                    itemStationSearchBar += "<p><B><U>Trajet le plus rapide : </U></B></p>"
                }
                if(data.journeys[i].type == 'comfort')
                {
                    itemStationSearchBar += "<p><B><U>Trajet le plus comfortable : </U></B></p>"
                }
                /*itemStationSearchBar += '<li class="item-content">' +
                 '<div class="item-inner">' +
                 '<a href="nextTrains.html?codeStation='+data[i].stop_area+'='+data[i].name+'">' +
                 '<div class="item-title">'+data[i].name+'</div>' +
                 '</a>' +
                 '</div>' +
                 '</li>';*/
                for(var j= 0; j < data.journeys[i].sections.length; j++)
                {
                    var time = data.journeys[i].sections[j].departure_date_time.split("T");
                    var fullTime = time[1];
                    var h = fullTime.slice(0,2);
                    var m = fullTime.slice(2,4);
                    var heure = h+":"+m;

                    /*if(data.journeys[i].sections[j].from !== undefined)
                     {
                     */if(data.journeys[i].sections[j].stop_date_times !== undefined)
                {
                    var arret = "";
                    for(var l = 1; l < data.journeys[i].sections[j].stop_date_times.length - 1; l++)
                    {
                        arret += data.journeys[i].sections[j].stop_date_times[l].stop_point.name+", ";
                    }

                    arret = arret.substring(0,arret.length - 2);
					

                    itemStationSearchBar += '<p>Je prends le '+ data.journeys[i].sections[j].display_informations.commercial_mode +' '
					+ data.journeys[i].sections[j].display_informations.code +' en partant de '+ data.journeys[i].sections[j].from.name +
					' en direction de  ' + data.journeys[i].sections[j].display_informations.direction + ' jusqu\'a ' 
					+data.journeys[i].sections[j].to.name+ ' à '+ heure+ ' en passant par '+arret+ '.</p>';
					itemStationSearchBar += '<p>Durée : '+ data.journeys[i].sections[j].duration +' secondes.</p>';
                }
                else{
                    if(data.journeys[i].sections[j].duration !== 0)
                    {
                        if(data.journeys[i].sections[j].type=="transfer" || data.journeys[i].sections[j].type=="waiting")
                        {
                            if(data.journeys[i].sections[j].type=="transfer"){
                                itemStationSearchBar += '<p>Je marche pendant '+data.journeys[i].sections[j].duration+ ' secondes.</p>';
                            }
                            if(data.journeys[i].sections[j].type=="waiting"){
                                itemStationSearchBar += '<p>J\'attends pendant '+data.journeys[i].sections[j].duration+ ' secondes.</p>';
                            }
                        }
                        else{

                            itemStationSearchBar += '<p>Je pars de '+ data.journeys[i].sections[j].from.name +' en direction de  ' + data.journeys[i].sections[j].to.name + ' à '+ heure+ '</p>';
                        }
                    }
                }
                }
                /*	else
                 {
                 itemStationSearchBar += '<p> Je marche pendant ' + data.journeys[i].sections[j].duration+' secondes';
                 }*/
                //}
                var temps = data.journeys[i].arrival_date_time.split("T");
                var tempsComplet = temps[1];
                var hour = tempsComplet.slice(0,2);
                var min = tempsComplet.slice(2,4);
                var arrive = hour+":"+min;
                itemStationSearchBar += '<p>Durée du trajet : '+data.journeys[i].duration+' sec dont '+data.journeys[i].durations.walking+' sec de marche</p>';
                itemStationSearchBar += '<p>Heure d\'arrivé : '+arrive+'</p>';
                itemStationSearchBar += '<br>';
            }
            if(itemStationSearchBar === "")
            {
                alert("Vide Vide Vide !!!!")
            }
            $$('#pathItinerary-page-content').html(itemStationSearchBar);

        }, this)).fail(function( jqXHR, textStatus, errorThrown )  {
            console.log('CALL API ITINERAIRE FAILED: ', jqXHR, textStatus, errorThrown);
        });
    }
}