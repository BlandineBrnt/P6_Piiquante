// schema de sauce.js requis
const Sauce = require("../models/Sauce");
// importation du package file system afin de modifier le système de fichiers
const fs = require("fs");

// Permet d'obtenir toutes les sauces de notre API.
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

// Permet d'obtenir une seule sauce de notre API.
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

// création de sauce
exports.createSauce = (req, res, next) => {
    // transformer la requête envoyée par le frontend en JSON
    const sauceObject = JSON.parse(req.body.sauce);
    // supprimer l'id mongoose généré par défaut
    delete sauceObject._id;
    // création du nouvel objet
    const sauce = new Sauce({
        // récupération du corps de la requête
        ...sauceObject,
        // modification de l'url de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersdisLiked: [],
    });
    // sauvegarde du nouvel objet dans la base de donnée
    sauce
        .save()
        // si aucune erreur répond 201 created et un message
        .then(() => res.status(201).json({ message: "Article enregistrée !" }))
        // si erreur répond une erreur 400 et un message d'erreur
        .catch((error) => {
            res.status(400).json({ error: error });
        });
};

// Permet à l'utilisateur de modifier les sauces de son choix qui l'a ajoutées uniquement.
exports.modifySauce = (req, res, next) => {
    if (req.file) {
        Sauce.findOne({ _id: req.params.id }).then((sauce) => {
            // récupération du deuxième élément du tableau constitué du avant/après '/images/' donc le après
            const filename = sauce.imageUrl.split("/images/")[1];
            // supprime le après '/images/' et début du callback
            console.log(sauce.imageUrl);
            fs.unlink(`images/${filename}`, () =>
                console.log("Image supprimée !")
            );
        });
    }
    // vérifie si l'objet existe
    const sauceObject = req.file
        ? {
              // récupération du corps de la requête
              ...JSON.parse(req.body.sauce),

              // traitement de la nouvelle image
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : // sinon on modifie juste le corps de la requête
          { ...req.body };
    // modification de la sauce dans la base de donnée
    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
        // réponse 200 + message si aucune erreur
        .then(() => res.status(200).json({ message: "Article modifiée !" }))
        // réponse 400 + message si erreur
        .catch((error) => res.status(400).json({ error: error }));
};

//Permet à l'utilisateur de supprimer les sauces de son choix qui l'a ajoutées uniquement.
exports.deleteOneSauce = (req, res, next) => {
    // récupère l'objet avec ses données
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // récupération du deuxième élément du tableau constitué du avant/après '/images/' donc le après
            const filename = sauce.imageUrl.split("/images/")[1];
            // supprime le après '/images/' et début du callback
            console.log(sauce.imageUrl);
            fs.unlink(`images/${filename}`, () => {
                // supprime la sauce de la base de donnée
                Sauce.deleteOne({ _id: req.params.id })
                    // réponse 200 + message si aucune erreur
                    .then(() =>
                        res.status(200).json({ message: "Article supprimé !" })
                    )
                    // réponse 400 + message si erreur
                    .catch((error) => res.status(400).json({ error: error }));
            });
        })
        // réponse 500 + message si erreur
        .catch((error) => res.status(500).json({ error: error }));
};
//POST like et dislike
exports.sauceLike = (req, res, next) => {
    //On récupère la sauce dans la BDD par son ID
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        //L'instruction switch évalue une expression et selon le résultat obtenu et le cas associé, exécute les instructions correspondantes.
        switch (req.body.like) {
            case 1:
                //Si l'utilisateur clique sur like

                //Si user n'est pas dans le tableau des users ayant liké et qu'il a aimé la sauce donc like =1
                if (!sauce.usersLiked.includes(req.body.userId)) {
                    //Mise à jour de la sauce dans la BD
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            //On incrémente le champ like a la forme suivante :{ $inc: { <field1>: <amount1>, <field2>: <amount2>, ... } }
                            $inc: { likes: 1 },
                            //on met user dans le tableau des usersLiked
                            $push: { usersLiked: req.body.userId },
                            //L'opérateur  $push ajoute une valeur spécifiée à un tableau et a la forme :{ $push: { <field1>: <value1>, ... } }
                        }
                    )
                        .then(() => {
                            res.status(201).json({
                                message: " Vous aimez cette sauce",
                            });
                        })
                        .catch((error) => res.status(400).json({ error })); // mauvaise requête
                }
                break;
            //Si l'utilisateur clique sur dislike
            case -1:
                //Si user n'est pas dans le tableau des users ayant disliké et qu'il n'a pas aimé la sauce donc dislike =1
                if (!sauce.usersDisliked.includes(req.body.userId)) {
                    //Mise à jour de la sauce dans la BDD
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            //Pas de request dislike
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: req.body.userId },
                            //L'opérateur  $push ajoute une valeur spécifiée à un tableau et a la forme :{ $push: { <field1>: <value1>, ... } }
                        }
                    )
                        .then(() => {
                            res.status(201).json({
                                message: " vous n aimez pas cette sauce",
                            });
                        })
                        .catch((error) => res.status(400).json({ error })); // mauvaise requête
                }
                break;
            //Si l'utilisateur change d'avis
            case 0:
                //Si c'est un like
                //Si user est dans le tableau des users ayant liké et que le like est à 0, donc s'il n'aime plus la sauce
                if (sauce.usersLiked.includes(req.body.userId)) {
                    //Mise à jour de la sauce dans la BD
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: -1 }, //on incrémente -1, car user n'aime plus la sauce
                            $pull: { usersLiked: req.body.userId }, //L'opérateur $pull supprime d'un tableau existant toutes
                            //les instances d'une valeur ou de valeurs qui correspondent à une condition spécifiée.
                        }
                    )
                        .then(() => {
                            res.status(201).json({
                                message: " vous avez retiré votre like",
                            });
                        })
                        .catch((error) => res.status(400).json({ error })); // mauvaise requête
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    //Si c'est un unlike
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            //On décrémente le champ like
                            $inc: { dislikes: -1 },
                            //on met user dans le tableau des usersDisliked
                            $pull: { usersDisliked: req.body.userId },
                        }
                    )
                        .then(() => {
                            res.status(201).json({
                                message: " vous avez retiré votre dislike",
                            });
                        })
                        .catch((error) => res.status(400).json({ error })); // mauvaise requête
                }
                break;
            default:
                res.status(401).json({
                    message: "Ce type de vote nest pas authorisé ",
                });
        }
    });
};
