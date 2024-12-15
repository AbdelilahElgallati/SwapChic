const Category = require("../models/categoryModel")

const addCategory = async (req, res) => {
  try {
    // console.log("Body:", req.body);
    // console.log("Query:", req.query);

    // Valider les données
    
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Le champ 'name' est requis pour créer une catégorie.",
      });
    }

    // Créer une nouvelle catégorie
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
}

const  getAllCategorys = async (req, res) => {
  try {
    const  Categorys = await Category.find();
    res.status(201).json(Categorys);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des catégories");
  }
}

const  getOneCategory = async (req, res) => {
  try {
    const  Category = await Category.findById(req.params.id);
    res.status(201).json(Category);
  } catch (error) {
    res.status(201).json({success : false, error});
  }
}

const  updateCategory = async (req,res)=>{
  try {
    
    const  Category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(201).json({success : true, Category});
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de catégorie");
  }
}

const  removeCategory = async (req, res) => {
  try {
    const  Category = await Category.findByIdAndDelete(req.params.id);
    res.status(201).json({success : true});
  } catch (error) {
    res.status(201).json({success : false, error});
  }
}

module.exports = {addCategory,getAllCategorys,getOneCategory,updateCategory,removeCategory};