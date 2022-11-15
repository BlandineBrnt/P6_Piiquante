// On importe le package multer qui nous permet de gérer nos fichiers téléchargés.
const multer = require("multer");

// Différents formats d'images qui seront téléchargées.
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// Ceci nous permettra d'enregister les images envoyées par les utilisateurs.
// On utilise la méthode destination pour définir le dossier où l'image sera enregistrée.
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // enregistre l'image dans le dossier 'images' du back
        callback(null, "images");
    },
    //la méthode filename pour renommer une image.
    filename: (req, file, callback) => {
        // enleve tout les espaces et crée un nom de fichier avec son extension
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    },
});

// On exporte uniquement le fichier image entièrement configuré.
module.exports = multer({ storage: storage }).single("image");
