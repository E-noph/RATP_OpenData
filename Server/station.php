<?php
/**
 * Created by PhpStorm.
 * User: Julien
 * Date: 19/06/2017
 * Time: 11:57
 */

function getStation()
{
    try
    {
        $bdd = new PDO('mysql:host=localhost;dbname=parisgo;charset=utf8', 'root', '');
    }
    catch (Exception $e)
    {
        die('Erreur : ' . $e->getMessage());
    }

    $reponse = $bdd->query("SELECT * FROM point ORDER BY name");

    $donnees = json_encode($reponse->fetchAll());
    return $donnees;
}

echo getStation();