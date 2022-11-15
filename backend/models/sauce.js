// ajout de mongoose pour la base de donnée
const mongoose = require("mongoose");

// Ajout du schéma de données pour chaque sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: false, default: 0 },
    dislikes: { type: Number, required: false, default: 0 },
    usersLiked: { type: Array, required: false, default: [] },
    usersDisliked: { type: Array, required: false, default: [] },
});

// exportation du schema pour l'appeler dans le controller sauce.js
module.exports = mongoose.model("Sauces", sauceSchema);
