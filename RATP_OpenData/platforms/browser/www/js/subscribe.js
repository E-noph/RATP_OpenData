/**
 * Created by Julien on 23/06/2017.
 */

class SubscribeView {

    constructor() {
        this._Host = 'http://134.157.46.188/';
        this._apiURIsubscribe = 'server/subscribe.php';
    }

    init() {
        console.log("subscribe:init()");

        this.getForm();
    }

    /**
     * Fonction pour récupérer les informations du futur utilisateur à partir du form
     */
    getForm() {
        $$('#subscribe').on('click', $.proxy(function() {

            let username = $$("#name-subscribe").val();
            let mail = $$("#mail-subscribe").val();
            let password = $$("#password-subscribe").val();
            let confirmPassword = $$("#confirm-password-subscribe").val();

            if (username == "") {
                myApp.alert("Merci de saisir un nom", "Erreur");
            } else if (mail == "") {
                myApp.alert("Merci de saisir un mail", "Erreur");
            } else if (mail.indexOf("@gmail.com") == -1 && mail.indexOf("@hotmail.fr") == -1 && mail.indexOf("@sfr.fr") == -1 &&
                mail.indexOf("@yahoo.fr") == -1 && mail.indexOf("@outlook.fr") == -1 && mail.indexOf("@live.fr") == -1) {
                myApp.alert("Merci de saisir un mail Valide", "Erreur");
            } else if (password == "") {
                myApp.alert("Merci de saisir un mot de passe", "Erreur");
            } else if (confirmPassword == "") {
                myApp.alert("Merci de saisir une confirmation du mot de passe", "Erreur");
            } else if (password != confirmPassword) {
                myApp.alert("Vos mots de passe ne sont pas identiques", "Erreur");
            } else {
                console.log("Envoi la fonction bébé !!!")
                subscribe.userSubscribe(username, mail, password);
            }

        }));
    }

    userSubscribe(username, mail, password) {
        console.log(username, mail, password);
        $.ajax({
            url: this._Host + this._apiURIsubscribe,
            data : { username : username, mail : mail, password : password },
            success : function(data)
            {
                console.log('getAPIsubscribe response', data);

                if (data == "Votre compte a été crée") {
                    myApp.alert(data, "Bienvenue chez ParisGo");
                    mainView.router.load({
                        url: 'index.html',
                    });
                    myApp.loginScreen();

                } else {
                    myApp.alert(data, "Erreur");
                }
            }
        });
    }

}