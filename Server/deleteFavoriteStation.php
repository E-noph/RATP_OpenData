<?php
/**
 * Created by PhpStorm.
 * User: Julien
 * Date: 22/06/2017
 * Time: 15:15
 */

function DeleteFavoriteStation()
{
    try
    {
        $bdd = new PDO('mysql:host=localhost;dbname=parisgo;charset=utf8', 'root', '');
    }
    catch (Exception $e)
    {
        die('Erreur : ' . $e->getMessage());
    }

    $reponse = $bdd->prepare("DELETE FROM favori WHERE id= ? ");
    $reponse->execute(array($_GET['idFav']));

    return "OK";
}

DeleteFavoriteStation();