const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/authRoutes"); // Assure-toi que le chemin est correct


dotenv.config();


const app = express();
app.use(express.json()); // Permet de lire les requêtes JSON
app.use(cors());

// ✅ Routes
app.use("/auth", authRoutes); // Assure-toi que le préfixe /auth est bien appliqué


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ultra-stock";

// ✅ Connexion à MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
