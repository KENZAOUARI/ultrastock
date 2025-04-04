const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("📩 Requête reçue sur /register :", req.body);

    try {
        // Récupérer les données envoyées dans le body
        const { username, email, password } = req.body;

        // Vérifier que tous les champs sont fournis
        if (!username || !email || !password) {
            console.log("⛔ Champs manquants");
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("⚠️ L'utilisateur existe déjà");
            return res.status(400).json({ message: "L'utilisateur existe déjà" });
        }

        // Hasher le mot de passe avant stockage
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("✅ Mot de passe haché");

        // Créer un nouvel utilisateur
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        console.log("🎉 Utilisateur enregistré avec succès");

        res.status(201).json({ message: "Utilisateur créé avec succès" });

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// ✅ Route de connexion (Login)
router.post("/login", async (req, res) => {
    console.log("📩 Requête reçue sur /login", req.body);

    try {
        const { email, password } = req.body;

        // Vérifier que les champs sont remplis
        if (!email || !password) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "secret_key",  // Assure-toi que la clé JWT est définie dans .env
            { expiresIn: "1h" }
        );

        res.json({ message: "Connexion réussie", token });

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
});


module.exports = router;





