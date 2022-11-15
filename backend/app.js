/* APPLICATION EXPRESS */

const express = require("express");
const mongoose = require("mongoose");

const path = require("path");
const app = express();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

//Routes
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

/**Connexion à la base de donnée MongoDB  */

//On appel la const mongoose pour nous connecter à la base de données MangoDB et on utilise une variable d'environnement pour sécuriser nos informations de connexion.
const { DB_USER, DB_PASSWORD, DB_CLUSTER_NAME } = process.env;
mongoose

    .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER_NAME}.mongodb.net/test?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )

    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.log("Connexion à MongoDB échouée !", err));

//creation de rate-limiter
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100, // Limite 100 requetes par 15 minutes
    message: "Try again in 15 minutes",
});
app.use(limiter);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});
app.use(cors());
// Middleware pour transformer les données des requêtes analysées en format json.
app.use(express.json());

// Gère la ressource image de manière statique
app.use("/images", express.static(path.join(__dirname, "images")));

// Démarrage des routes
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

//Exportation de l'application
module.exports = app;
