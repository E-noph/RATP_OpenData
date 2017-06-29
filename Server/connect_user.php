<?php
/**
 * Created by PhpStorm.
 * User: Julien
 * Date: 19/06/2017
 * Time: 15:47
 */

function connectUser()
{
    try
    {
        $bdd = new PDO('mysql:host=localhost;dbname=parisgo;charset=utf8', 'root', '');
    }
    catch (Exception $e)
    {
        die('Erreur : ' . $e->getMessage());
    }

    $reponse = $bdd->query("SELECT * FROM user WHERE mail='".$_GET['email']."' AND password='".$_GET['password']."'");

    $donnees = json_encode($reponse->fetchAll());
    return $donnees;

}

echo connectUser();