const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Créer un produit
router.post("/", async (req, res) => {
  try {
    const { name, price, category, description, stock } = req.body;
    const newProduct = new Product({ name, price, category, description, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du produit", error });
  }
});

// Récupérer tous les produits
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des produits", error });
  }
});

// Mettre à jour un produit
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du produit", error });
  }
});

// Supprimer un produit
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du produit", error });
  }
});

module.exports = router;
