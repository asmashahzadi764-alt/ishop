// controllers/productController.js
import Product from "../models/productModel.js";

// ---------------------------------------
// ADD PRODUCT
// ---------------------------------------
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: image || null, // image optional
    });

    return res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log("Add Product Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------
// UPDATE PRODUCT
// ---------------------------------------
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      message: "Product updated successfully",
      updated,
    });
  } catch (error) {
    console.log("Update Product Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------
// DELETE PRODUCT
// ---------------------------------------
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Delete Product Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------
// GET ALL PRODUCTS
// ---------------------------------------
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    console.log("Get Products Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------
// GET SINGLE PRODUCT
// ---------------------------------------
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.log("Get Product Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
