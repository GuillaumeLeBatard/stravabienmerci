var acc_tok = "token";//variable globale pour le token d'accès
var bearer_token = "Bearer " + acc_tok;
var athlete = "init";
var stats = "init";
var hmembres = "init";
var hacti = "init";
var dist = new Array(40);// provision pour de nouveaux petits hamsters
var toto = 0;
var text_dist="";

/* Création de l'objet access_token */
var oauth = new XMLHttpRequest();

/* Définition de l'appel */
oauth.open("POST", "http://www.strava.com/oauth/token?client_id=40051&client_secret=43e7f3cdc42b1c788b7dedc6acc98216654fbffd&code=c4def03fa2286aed701719e56ed0209af64e867a&grant_type=authorization_code", true);

/* Déclenchement de l'appel */
oauth.send();
oauth.onload = function () {
    if (this.status == 200) {
        athlete = JSON.parse(this.response);
        acc_tok = athlete.access_token;
        //document.getElementById("athlete_get").innerHTML = this.response;
        bearer_token = "Bearer " + acc_tok;
        //document.getElementById("acc_tok").innerHTML = bearer_token;

        /* Création de l'objet ajax */
        var ajax = new XMLHttpRequest();

        /* Définition de l'appel */
        ajax.open("GET", "https://www.strava.com/api/v3/athletes/11320987/stats?id=11320987&page=&per_page", true);
        //ajax.setRequestHeader("Authorization","Bearer 9fd722c5d8d08cd5e541395e50a8eb64ffd1d2b5");
        ajax.setRequestHeader("Authorization", bearer_token);
        /* Déclenchement de l'appel */
        ajax.send();
        ajax.onload = function () {
            if (this.status == 200) {
                stats = JSON.parse(this.response);
                var avg_bike_spd = stats.ytd_ride_totals.distance / stats.ytd_ride_totals.moving_time;
                document.getElementById("retour1").innerHTML = avg_bike_spd * 3.6;//this.response;
                var avg_run_spd = stats.ytd_run_totals.moving_time / stats.ytd_run_totals.distance;
                document.getElementById("retour2").innerHTML = avg_run_spd * 1000 / 60;//this.response;
            }
        }

        /* Création de l'objet membres */
        var membres = new XMLHttpRequest();
        /* appel membres hamsters */
        /* Définition de l'appel */
        membres.open("GET", "https://www.strava.com/api/v3/clubs/198368/members", true);
        membres.setRequestHeader("Authorization", bearer_token);
        /* Déclenchement de l'appel */
        membres.send();
        membres.onload = function () {
            if (this.status == 200) {
                hmembres = JSON.parse(this.response);
                document.getElementById("retour3").innerHTML = hmembres.length;//nb_hamsters.length;//this.response; 
            }
        }
        /* Création de l'objet acti */
        var acti = new XMLHttpRequest();/* appel activités hamsters */
        /* Définition de l'appel */
        acti.open("GET", "https://www.strava.com/api/v3/clubs/198368/activities", true);
        acti.setRequestHeader("Authorization", bearer_token);
        /* Déclenchement de l'appel */
        acti.send();
        acti.onload = function () {
            if (this.status == 200) {
                hacti = JSON.parse(this.response);
                var last_hamster = hacti[0].athlete.firstname + " " + hacti[0].athlete.lastname;
                document.getElementById("retour4").innerHTML = last_hamster;//this.response;
                var dist_tot=0;
                for (var i = 0; i < hmembres.length; i++){
                    dist[i]=0;
                    
                    for (var j = 0; j < hacti.length; j++){
                        if (hmembres[i].firstname === hacti[j].athlete.firstname && hmembres[i].lastname === hacti[j].athlete.lastname){
                            if (hacti[j].type === "Ride"){
                                dist[i] = dist[i] + hacti[j].distance;
                                dist_tot=dist_tot+dist[i];
                                text_dist += dist[i] + "<br>";
                            }
                        }
                    }
                }
                /*document.getElementById("distance").innerHTML = dist_tot;*/
                document.getElementById("distance").innerHTML = text_dist;       
            }
        }
    }
}