import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// -------------------------
// Multer config for file uploads
// -------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads folder (create in root)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// -------------------------
// GET All Products
// -------------------------
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// -------------------------
// POST New Product (File upload or URL)
// -------------------------
router.post("/", upload.single("imageFile"), async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;

    let imagePath = image || ""; // default image from URL
    if (req.file) {
      // if file uploaded, override image URL
      imagePath = `/uploads/${req.file.filename}`;
    }

    if (!name || !price || !category || !imagePath) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image: imagePath,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error while adding product" });
  }
});

// -------------------------
// UPDATE Product by ID
// -------------------------
router.put("/:id", upload.single("imageFile"), async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;

    let imagePath = image || "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category, image: imagePath },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// -------------------------
// DELETE Product by ID
// -------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;
