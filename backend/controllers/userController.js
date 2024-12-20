const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("../utils/cloudinary");
const User = require("../models/userModel");

const addUser = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { name, email, password, phone, localisation } = req.body;
    const photoFile = req.file;

    // Vérification des champs obligatoires
    if (!name || !email || !password || !phone || !localisation) {
      console.log("Tous les champs doivent être remplis.");
      
      return res.status(400).json({
        success: false,
        message: "Tous les champs doivent être remplis.",
      });
    }

    const existeUser = await User.findOne({ email: email });
    if (existeUser) {
      console.log("L'utilisateur existe déjà");
      
      return res
        .status(400)
        .json({ success: false, message: "L'utilisateur existe déjà." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const uploadResult = await cloudinary.uploader.upload(photoFile.path, {
      folder: "users", 
    });

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      localisation,
      photo: uploadResult.secure_url,
    });

    await user.save();
    console.log("Utilisateur ajouté avec succès");
    
    res
      .status(201)
      .json({ success: true, message: "Utilisateur ajouté avec succès", user });
  } catch (error) {
    console.error("Erreur lors de l'ajout d'utilisateur :", error);
    return res.status(500).json({
      success: false,
      message: `Erreur serveur lors de l'ajout d'utilisateur : ${error.message}`,
    });
  }
};

// const addUser = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);
//     console.log("Uploaded File:", req.file);

//     const { name, email, password, phone, localisation } = req.body;

//     if (!name || !email || !password || !phone || !localisation || req.file ) {
//       return res.status(400).json({
//         success: false,
//         message: "Tous les champs doivent être remplis.",
//       });
//     }

//     const photo = req.file ? {
//       id: req.file.id,
//       filename: req.file.filename,
//       constentType: req.file.mimetype

//     }: null;

//     const existeUser = await User.findOne({ email: email });
//     if (existeUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "L'utilisateur existe déjà" });
//     }
//     if (!password) {
//       return res.status(400).json({
//         success: false,
//         message: "Le mot de passe est requis.",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       localisation,
//       photo,
//     });

//     await user.save();
//     res.status(201).json({ success: true, message: "Utilisateur ajouté avec succès", user });
//   } catch (error) {
//     console.error("Erreur lors de l'ajout d'utilisateur :", error);
//     return res.status(500).json({
//       success: false,
//       message: `Erreur serveur lors de l'ajout d'utilisateur : ${error}`,
//       error,
//     });
//   }
// };

const getAllUsers = async (req, res) => {
  try {
    const Users = await User.find();
    res.status(201).json(Users);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche d'utilisateur");
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Pour renvoyer l'image en tant que fichier binaire
    res.set("Content-Type", "image/jpeg");
    res.send(user.photo);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

const updateUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const data = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      localisation: req.body.localisation,
    };

    if (req.file) {
      const ImgId = currentUser.photo.public_id;
      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }

      const result = await cloudinary.uploader
        .upload_stream(
          {
            folder: "Users",
          },
          async (error, result) => {
            if (error) {
              console.error(error);
              res.status(500).send({
                success: false,
                message: "Erreur serveur lors de la mise à jour d'utilisateur",
                error,
              });
            } else {
              data.photo = {
                public_id: result.public_id,
                url: result.secure_url,
              };

              const User = await User.findByIdAndUpdate(req.params.id, data, {
                new: true,
              });
              res.status(200).json({
                success: true,
                User,
              });
            }
          }
        )
        .end(req.file.buffer);
    } else {
      const User = await User.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      res.status(200).json({
        success: true,
        User,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour d'utilisateur",
      error,
    });
  }
};

const updateStausUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    res.status(200).json({
      success: true,
      enterprise,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour du statut de l'utilisateur",
    });
  }
};

const removeUser = async (req, res) => {
  try {
    const User = await User.findByIdAndDelete(req.params.id);
    res.status(201).json(User);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression d'utilisateur");
  }
};

const login = async (req, res) => {
  try {
    const jsenwebtkn = req.token;
    const user = req.user;
    res.json({ jsenwebtkn, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getOneUser,
  updateUser,
  removeUser,
  login,
  changePassword,
  updateStausUser,
};
