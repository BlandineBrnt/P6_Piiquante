// ajout de bcryp pour pour crypté le mot de passe(hash) de l'utilisateur
const bcrypt = require("bcrypt");
// On importe le package jsonwebtoken, pour générer un jeton d'accès(token) encodé à notre utilisateur lors de l'inscription et de le vérifier par la suite lors de la connexion.
const jwt = require("jsonwebtoken");
// On importe notre fichier user.js de notre dossier models contenant le model, puisque on va devoir enregistrer des utilisateurs(signup) et lire des utilisateurs(login) dans nos middlewares.
const User = require("../models/User");
// On importe le package dotenv pour pouvoir utiliser par la suite la ou les variable(s) d'environnement.
require("dotenv").config();

//Fonction qui permet de verifier que l'email est correctement saisi
function checkEmail(mail) {
    const emailRegEx = new RegExp(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/gi
    );
    return emailRegEx.test(mail);
}

// Création de nouvel utilisateur
exports.signup = (req, res, next) => {
    if (!checkEmail(req.body.email)) {
        res.status(400).json({
            error: "L'email n'a pas un format valide.",
        });
    } else {
        let passValidate = schema.validate(req.body.password, {
            details: true,
        });
        let passValidateMsg = passValidate.map((x) => x.message);
        if (passValidate.length > 0) {
            res.status(400).json({
                message: passValidateMsg,
            });
        } else {
            // On appel la fonction hash, pour crypter un mot de passe et il va éxectuer 10 tour pour notre algorithme de cryptage.
            bcrypt
                .hash(req.body.password, 10)
                .then((hash) => {
                    // Inscription du nouvel utilisateur
                    const user = new User({
                        email: req.body.email,
                        password: hash, // Mot de passe crypté (hash).
                    });
                    user.save() // On utilise la méthode save pour enregistrer l'utilisateur dans la base de données.
                        .then(() => {
                            res.status(201).json({
                                message: "Utilisateur créé!",
                            });
                        })
                        .catch((error) => {
                            res.status(400).json({
                                error: error,
                            });
                        });
                })
                .catch((error) => res.status(500).json({ error }));
        }
    }
};

// Middleware pour la connexion(ou d'identification) de l'utilisateur.
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // On utilise la méthode findOne pour trouver un seul utilisateur de la base de données et de son email.
        .then((user) => {
            // si elle est introuvable répond une erreur 401 + message
            if (!user) {
                return res
                    .status(401)
                    .json({ error: "Utilisateur non trouvé !" });
            }
            // bcrypt compare le mot de passe de la base de donnée et celui entré
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    // si le mot de passe n'est pas valide réponds 401 + message
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ error: "Mot de passe incorrect !" });
                    }
                    // si le mot de passe est valide réponse 200 + réponse json contenant l'ID de l'utilisateur et un token
                    res.status(200).json({
                        // Création de token d'authentification
                        userId: user._id,
                        // attribution d'un token
                        token: jwt.sign(
                            // indentifiant de l'user dans la base de données
                            { userId: user._id },
                            // clé d'encodage avec délais d'expiration
                            "RANDOM_TOKEN_SECRET",
                            { expiresIn: "24h" }
                        ),
                    });
                })

                .catch((error) => res.status(500).json({ error }));
        })

        .catch((error) => res.status(500).json({ error }));
};
