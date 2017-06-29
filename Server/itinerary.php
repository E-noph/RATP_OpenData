<?php
/**
 * Created by PhpStorm.
 * User: Julien
 * Date: 19/06/2017
 * Time: 11:57
 */

function getStationCode()
{
    try
    {
        $bdd = new PDO('mysql:host=localhost;dbname=parisgo;charset=utf8', 'root', '');
    }
    catch (Exception $e)
    {
        die('Erreur : ' . $e->getMessage());
    }
		
    $reponse = $bdd->query('SELECT stop_area FROM point WHERE name="'.$_GET["station"].'"');
    $donnees = $reponse->fetch();
    return $donnees["stop_area"];
}

echo getStationCode();