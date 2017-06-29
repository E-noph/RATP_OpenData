<?php
/**
 * Created by PhpStorm.
 * User: Julien
 * Date: 22/06/2017
 * Time: 11:56
 */

function favoritesStations()
{
    try
    {
        $bdd = new PDO('mysql:host=localhost;dbname=parisgo;charset=utf8', 'root', '');
    }
    catch (Exception $e)
    {
        die('Erreur : ' . $e->getMessage());
    }

    $reponse = $bdd->query("SELECT P.name, P.stop_area, F.id AS idPoint FROM point AS P, favori AS F WHERE P.id=F.id_point AND F.id_User=".$_GET['id']);

    $donnees = json_encode($reponse->fetchAll());
    return $donnees;

}

echo favoritesStations();