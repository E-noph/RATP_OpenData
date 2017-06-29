<?php
/**
 * Created by PhpStorm.
 * User: Julien
 * Date: 26/06/2017
 * Time: 09:17
 */


function AddFavoriteStation()
{
    try
    {
        $bdd = new PDO('mysql:host=localhost;dbname=parisgo;charset=utf8', 'root', '');
    }
    catch (Exception $e)
    {
        die('Erreur : ' . $e->getMessage());
    }

    if (isset($_GET['codeStation'])) {

        $reponse = $bdd->query("SELECT id FROM point WHERE stop_area='".$_GET['codeStation']."'");
        $idpoint = $reponse->fetch();

        $reponse = $bdd->query("SELECT id FROM favori WHERE id_User=".$_GET['userID']." AND id_point=".$idpoint['id']);
        $donnees = $reponse->fetch();

        if (sizeof($donnees["id"]) == 1) {
            return "station favori+".$donnees['id'];
        } else {
            return "station pas favori+".$idpoint['id'];
        }

    } else {
        $reponse = $bdd->query("SELECT id FROM favori WHERE id_User=".$_GET['userID']." AND id_point=".$_GET['pointID']);
        $donnees = $reponse->fetch();

        if (sizeof($donnees) != 1) {
            return "Cette station est déja dans vos favori !";
        } else {
            $bdd->query("INSERT INTO `favori`(`id_User`, `id_point`) VALUES (".$_GET['userID'].",".$_GET['pointID'].")");
            return "Favori ajouté";
        }
    }
}

echo AddFavoriteStation();