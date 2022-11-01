const express = require("express"); // ajout d'express
const router = express.Router(); // On utilise la méthode express.Router() qui nous permet de créer des routeurs séparés pour chaque route principale de l'application.
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
