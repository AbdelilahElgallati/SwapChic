const Like = require("../models/likeModel")

const addLike = async (req, res) => {
  try {
    // console.log(req.body)
    const {userId, productId} = req.body;
    const like = new Like({
      userId, productId
    });
    await like.save();
    res.status(200).json({
      success: true,
      like    
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout du like");
  }
}

const getAllLikes = async (req, res) => {
  try {
    const Likes = await Like.find();
    res.status(201).json(Likes);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des Likes");
  }
}

const getAllLikesUser = async (req, res) => {
  try {
    const likes = await Like.find({ userId: req.params.id });
    res.status(201).json(likes);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des Likes");
  }
}

const getAllLikesUserId = async (req, res) => {

  try {
    const likedProducts = await Like.find({ userId: req.params.userId }).populate({
      path: "productId",
      model: "Product",
    });

    const products = likedProducts.map((like) => like.productId);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des Likes");
  }
};

const  getOneLike = async (req, res) => {
  try {
    const  Like = await Like.findById(req.params.id);
    res.status(201).json({Like, success: true});
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de Like");
  }
}

const  getOneLikeByProductIdAndUserId = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const like = await Like.findOne({ userId, productId });

    if (!like) {
      return res.status(404).json({ success: false, message: "Like non trouvé" });
    }
    res.json({like, success: true});
  } catch (error) {
    console.error("Error fetching like:", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la récupération du like" });
  }
}

const  removeLike = async (req, res) => {
  try {
    const { id } = req.params;

    const like = await Like.findByIdAndDelete(id);

    if (!like) {
      return res.status(404).json({ success: false, message: "Like introuvable" });
    }

    res.json({ success: true, message: "Like supprimé" });
  } catch (error) {
    console.error("Error deleting like:", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la suppression du like" });
  }
}

module.exports = {addLike,getAllLikes,getAllLikesUser,getOneLike,removeLike, getOneLikeByProductIdAndUserId, getAllLikesUserId};