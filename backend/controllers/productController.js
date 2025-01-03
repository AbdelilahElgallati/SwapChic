const Product = require("../models/productModel");
const cloudinary = require("../utils/cloudinary");

const addProduct = async (req, res) => {
  try {
    const { userId, categoryId, name, description, condition, price, type } =
      req.body;
    const photoFile = req.file;
    // console.log(photoFile);

    if (
      !userId ||
      !categoryId ||
      !name ||
      !description ||
      !condition ||
      !price ||
      !type
    ) {
      console.log("Tous les champs doivent être remplis.");

      return res.status(400).json({
        success: false,
        message: "Tous les champs doivent être remplis.",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(photoFile.path, {
      folder: "product",
    });

    const product = new Product({
      userId,
      categoryId,
      name,
      description,
      condition,
      price,
      type,
      photo: uploadResult.secure_url,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Produit ajouté avec succès.",
      product,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de produit :", error);
    return res.status(500).json({
      success: false,
      message: `Erreur serveur lors de l'ajout du produit : ${error.message}`,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const Products = await Product.find().populate("categoryId", "name");
    res.status(201).json(Products);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des produits");
  }
};

const getAllProductsUser = async (req, res) => {
  try {
    const Products = await Product.find({ userId: req.params.id }).populate("categoryId", "name");
    res.status(201).json(Products);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des produits");
  }
};

const getProductSearchName = async (req, res) => {
  try {
    const query = req.params.name;
    const products = await Product.find({ name: { $regex: query, $options: "i" } }).populate("categoryId", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des produits");
  }
};

const getProductSearchUserName = async (req, res) => {
  try {
    const query = req.params.name;
    const userId = req.params.id;
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
      userId: userId
    }).populate("categoryId", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des produits");
  }
};

const getAllProductsCategory = async (req, res) => {
  try {
    const Products = await Product.find({ categoryId: req.params.id }).populate("categoryId", "name");
    res.status(201).json(Products);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des produits");
  }
};

const getAllProductsCategoryUser = async (req, res) => {
  try {
    const Products = await Product.find({ categoryId: req.params.idCategory, userId: req.params.idUser }).populate("categoryId", "name");
    res.status(201).json(Products);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des produits");
  }
};

const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId", "name");

    if (!product) {
      return res.status(404).send("Produit non trouvé.");
    }

    res.status(200).json(product); 
  } catch (error) {
    console.error("Erreur serveur :", error); 
    res.status(500).send("Erreur serveur lors de la recherche de produit");
  }
};


const updateProduct = async (req, res) => {
  try {
    const data = {
      userId: req.body.userId,
      categoryId: req.body.categoryId,
      name: req.body.name,
      description: req.body.description,
      condition: req.body.condition,
      price: req.body.price,
      type: req.body.type,
    };

    const photoFile = req.file;

    const uploadResult = await cloudinary.uploader.upload(photoFile.path, {
      folder: "product",
    });

    data.photo = uploadResult.secure_url;

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour de produit",
      error,
    });
  }
};

const removeProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de produit");
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getAllProductsUser,
  getAllProductsCategory,
  getOneProduct,
  updateProduct,
  removeProduct,
  getProductSearchName,
  getAllProductsCategoryUser,
  getProductSearchUserName,
};
