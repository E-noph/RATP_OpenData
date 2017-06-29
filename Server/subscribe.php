<?php
/**
 * Created by PhpStorm.
 * User: Julien
 * Date: 24/06/2017
 * Time: 11:28
 */

function Usersubscribe()
{
    try
    {
        $bdd = new PDO('mysql:host=localhost;dbname=parisgo;charset=utf8', 'root', '');
    }
    catch (Exception $e)
    {
        die('Erreur : ' . $e->getMessage());
    }

    $reponse = $bdd->query("SELECT mail FROM user WHERE mail='".$_GET['mail']."'");
    $donnees = $reponse->fetch();

    if (sizeof($donnees) != 1) {
        return "Erreur adresse mail existante !";
    } else {
        $bdd->query("INSERT INTO `user`(`name`, `mail`, `password`) VALUES ('".$_GET['username']."','".$_GET['mail']."','".$_GET['password']."')");
        return "Votre compte a été crée";
    }
}

echo Usersubscribe();