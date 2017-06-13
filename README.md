# RATP_OpenData
Projet tutoré de fin d'année ( Licence Projet Web à UPMC ) : 

Proposer à un voyageur du métro parisien le trajet réellement le plus rapide (pas celui prévu en gare, le
vrai !). Est-ce possible ?

DATARATP a ouvert les données réelles de passage de ses rames de métro. (Il est annoncé : Si la ligne
demandée est équipée du système SIEL(isRealmRealTime), les horaires retournés seront "tempsRéel".)
Elle offre aussi une API pour interroger ses données, ainsi cette API permet de connaître les stations les plus
proches de votre position. L’heure réelle de passage à chaque station..... (cf documentation à partir de http://www.ratp.fr/fr/ratp/r_70350/open-data/)

L’appli qui vous est commandée devra proposer quelques-unes des fonctionnalités suivantes :

- calculer le temps de parcours réel selon l’état du réseau à l’instant d’interrogation.

- Proposer le meilleur parcours.

- Visualiser les statistiques suivant les jours, les heures et les événements annoncés sur le réseau.

- Visualiser une carte du trafic instantané réel (http://tracker.geops.de/)

- L’utilisateur présent sur la ligne pourra noter la prédiction de l’application : l’heure de passage

est-elle juste ?
