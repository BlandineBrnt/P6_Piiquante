// ajout d'express
const express = require("express");
// appel du router qui nous permet de créer des routeurs séparés pour chaque route principale de l'application.
const router = express.Router();

// importation du controller user.js afin de relier les fonctions de ce dernier au routeur user.js
const userCtrl = require("../controllers/user");

// Routes individuelles de notre routeur.
router.post("/signup", userCtrl.signup); // Route pour l'inscription de l'utilisateur.
router.post("/login", userCtrl.login); // Route pour la connexion de l'utilisateur.

module.exports = router; // On exporte notre routeur finale pour pouvoir l'utiliser.
