const Reviewe = require("../models/reviewModel")

const addReviewe = async (req, res) => {
  try {
    const RevieweData = req.body.reviewe;
    const Reviewe = new Reviewe(RevieweData);
    await Reviewe.save();
    res.status(200).json({
      success: true,
      Reviewe,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout du review");
  }
}

const getAllReviewes = async (req, res) => {
  try {
    const Reviewes = await Reviewe.find();
    res.status(201).json(Reviewes);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des reviewes");
  }
}

const getAllReviewesUser = async (req, res) => {
  try {
    const Reviewes = await Reviewe.find({ userId: req.params.id });
    res.status(201).json(Reviewes);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des reviewes");
  }
}

const getAllReviewesSender = async (req, res) => {
  try {
    const Reviewes = await Reviewe.find({ revieweId: req.params.id });
    res.status(201).json(Reviewes);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des reviewes");
  }
}

const  getOneReviewe = async (req, res) => {
  try {
    const  Reviewe = await Reviewe.findById(req.params.id);
    res.status(201).json(Reviewe);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de reviewe");
  }
}

const  updateReviewe = async (req,res)=>{
  try {
    const  Reviewe = await Reviewe.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json({
      success: true,
      Reviewe,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de reviewe");
  }
}

const  removeReviewe = async (req, res) => {
  try {
    const  Reviewe = await Reviewe.findByIdAndDelete(req.params.id);
    res.status(201).json(Reviewe);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de reviewe");
  }
}

module.exports = {addReviewe,getAllReviewes,getAllReviewesUser,getAllReviewesSender,getOneReviewe,updateReviewe,removeReviewe};