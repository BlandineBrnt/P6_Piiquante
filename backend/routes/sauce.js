// ajout d'express
const express = require("express");
// appel du router qui nous permet de créer des routeurs séparés pour chaque route principale de l'application.
const router = express.Router();

// variable qui appelle le controller sauces.js
const sauceCtrl = require("../controllers/sauce");
// variable qui appelle le middleware auth.js
const auth = require("../middleware/auth");
// variable qui appelle le middleware multer
const multer = require("../middleware/multer");

router.get("/", auth, sauceCtrl.getAllSauce); // // Route pour obtenir toutes les sauces de l'API.

router.post("/", auth, multer, sauceCtrl.createSauce); // Route pour l'ajout d'une nouvelle sauce par l'utilisateur qui sera stockée dans l'API.

router.get("/:id", auth, sauceCtrl.getOneSauce); // Route pour obtenir une sauce a l'aide de son :id stockée dans l'API.

router.put("/:id", auth, multer, sauceCtrl.modifySauce); // Route pour modfier une sauce ajoutée par son utilisateur.

router.delete("/:id", auth, sauceCtrl.deleteOneSauce); // Route qui permet de supprimer une sauce par son utilisateur.

router.post("/:id/like", auth, sauceCtrl.sauceLike); // Route qui permet de liker ou disliker une sauce une sauce par utilisateur.

module.exports = router; // On exporte le routeur finale pour pouvoir l'utiliser.
