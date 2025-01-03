const Category = require("../models/categoryModel");

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Le champ 'name' est requis pour créer une catégorie.",
      });
    }
    const newCategory = new Category({ name });
    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Catégorie ajoutée avec succès.",
      category: newCategory,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la catégorie :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'ajout de la catégorie.",
      error: error.message,
    });
  }
};

const getAllCategorys = async (req, res) => {
  try {
    const Categorys = await Category.find();
    res.status(201).json(Categorys);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des catégories");
  }
};

const getCategoriesWithProductCount = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products", // Nom de la collection des produits
          localField: "_id", // Champ de clé primaire de Category
          foreignField: "categoryId", // Champ de clé étrangère dans Product
          as: "products", // Données des produits associées
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" }, // Compte le nombre de produits dans chaque catégorie
        },
      },
      {
        $project: {
          name: 1, // Affiche seulement le nom de la catégorie
          productCount: 1, // Affiche le nombre de produits
          image: 1, // Ajoute l'image (si nécessaire)
        },
      },
    ]);

    // Retourner les catégories avec le nombre de produits
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Récupérer une catégorie spécifique avec ses produits
const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ categoryId: categoryId });
    return res.status(200).json({ category, products });
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getOneCategory = async (req, res) => {
  try {
    const Category = await Category.findById(req.params.id);
    res.status(201).json(Category);
  } catch (error) {
    res.status(201).json({ success: false, error });
  }
};

const getCategorySearchName = async (req, res) => {
  try {
    const query = req.params.name;
    const category = await Category.find({ name: { $regex: query, $options: "i" } });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des category");
  }
}

const updateCategory = async (req, res) => {
  try {
    const Category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json({ success: true, Category });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de catégorie");
  }
};

const removeCategory = async (req, res) => {
  try {
    const Category = await Category.findByIdAndDelete(req.params.id);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(201).json({ success: false, error });
  }
};

module.exports = {
  addCategory,
  getAllCategorys,
  getCategoriesWithProductCount,
  getOneCategory,
  getCategoryById,
  updateCategory,
  removeCategory,
  getCategorySearchName,
};
