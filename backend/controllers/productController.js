const Product = require("../models/productModel");
const cloudinary = require("../utils/cloudinary");

const addProduct = async (req, res) => {
  try {
    const { userId, categoryId, name, description, condition, price } =
      req.body;
    const photoFile = req.file;
    console.log(photoFile);

    if (!userId || !categoryId || !name || !description || !condition || !price) {
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
    const Products = await Product.find();
    res.status(201).json(Products);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des produits");
  }
};

const getAllProductsUser = async (req, res) => {
  try {
    const Products = await Product.find({ userId: req.params.id });
    res.status(201).json(Products);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des produits");
  }
};

const getAllProductsCategory = async (req, res) => {
  try {
    const Products = await Product.find({ categoryId: req.params.id });
    res.status(201).json(Products);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des produits");
  }
};

const getOneProduct = async (req, res) => {
  try {
    const Product = await Product.findById(req.params.id);
    res.status(201).json(Product);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de produit");
  }
};

// const updateProduct = async (req, res) => {
//   try {
//     const currentProduct = await Product.findById(req.params.id);
//     if (!currentProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Produit non trouvé.",
//       });
//     }

//     const data = {
//       userId: req.body.userId,
//       categoryId: req.body.categoryId,
//       name: req.body.name,
//       description: req.body.description,
//       condition: req.body.condition,
//       price: req.body.price,
//     };

//     if (req.files && req.files.length > 0) {
//       if (currentProduct.photos && currentProduct.photos.length > 0) {
//         await Promise.all(
//           currentProduct.photos.map(async (photo) =>
//             cloudinary.uploader.destroy(photo.public_id)
//           )
//         );
//       }

//       const photosLinks = await Promise.all(
//         req.files.map(async (file) => {
//           const result = await cloudinary.uploader.upload(file.path, {
//             folder: "Products",
//           });
//           return {
//             public_id: result.public_id,
//             url: result.secure_url,
//           };
//         })
//       );

//       data.photos = photosLinks;
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       data,
//       {
//         new: true, 
//       }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Produit non trouvé après mise à jour.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Produit mis à jour avec succès.",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour de produit :", error);
//     return res.status(500).json({
//       success: false,
//       message: "Erreur serveur lors de la mise à jour de produit.",
//       error,
//     });
//   }
// };

const updateProduct = async (req, res) => {
  try {
    // Récupérer le produit actuel
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé.",
      });
    }

    // Préparer les données de mise à jour
    const data = {
      userId: req.body.userId,
      categoryId: req.body.categoryId,
      name: req.body.name,
      description: req.body.description,
      condition: req.body.condition,
      price: req.body.price,
    };

    // Gestion des fichiers photos
    if (req.files && req.files.length > 0) {
      // Suppression des anciennes photos sur Cloudinary
      if (currentProduct.photos && currentProduct.photos.length > 0) {
        await Promise.all(
          currentProduct.photos.map(async (photo) => {
            try {
              await cloudinary.uploader.destroy(photo.public_id);
            } catch (error) {
              console.error(`Erreur lors de la suppression de l'image : ${photo.public_id}`, error);
            }
          })
        );
      }

      // Téléchargement des nouvelles photos
      const photosLinks = await Promise.all(
        req.files.map(async (file) => {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: "Products",
            });
            return {
              public_id: result.public_id,
              url: result.secure_url,
            };
          } catch (error) {
            console.error("Erreur lors du téléchargement de l'image :", error);
            throw new Error("Erreur lors du téléchargement des images.");
          }
        })
      );

      data.photos = photosLinks;
    }

    // Mise à jour du produit dans la base de données
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true, // Retourner le produit mis à jour
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé après mise à jour.",
      });
    }

    // Envoi de la réponse
    return res.status(200).json({
      success: true,
      message: "Produit mis à jour avec succès.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de produit :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour de produit.",
      error: error.message,
    });
  }
};

const removeProduct = async (req, res) => {
  try {
    const Product = await Product.findByIdAndDelete(req.params.id);
    res.status(201).json(Product);
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
};
