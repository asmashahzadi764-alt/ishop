import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// =========================
// MULTER CONFIG (UPLOADS)
// =========================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// =========================
// GET ALL PRODUCTS
// =========================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error("GET products error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// =========================
// ADD PRODUCT (FIXED)
// =========================
router.post("/", upload.single("imageFile"), async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // image logic (safe)
    let imagePath = "";

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (image) {
      imagePath = image;
    }

    // validation (FIXED)
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price, category are required",
      });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category: category.toLowerCase().trim(),
      image: imagePath || "/uploads/default.png",
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("POST product error:", err);
    res.status(500).json({ message: "Server error while adding product" });
  }
});

// =========================
// UPDATE PRODUCT
// =========================
router.put("/:id", upload.single("imageFile"), async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;

    let imagePath = image;

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        category: category?.toLowerCase().trim(),
        image: imagePath,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE error:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// =========================
// DELETE PRODUCT
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;