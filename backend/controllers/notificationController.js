const Notification = require("../models/notificationModel")

const addNotification = async (req, res) => {
  try {
    const NotificationData = req.body.notification;
    const Notification = new Notification(NotificationData);
    await Notification.save();
    res.status(200).json({
      success: true,
      Notification,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout du notification");
  }
}

const getAllnotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(201).json(notifications);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des notifications");
  }
}

const getAllnotificationsUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.id });
    res.status(201).json(notifications);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des notifications");
  }
}

const  getOneNotification = async (req, res) => {
  try {
    const  notification = await Notification.findById(req.params.id);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de notification");
  }
}

const  updateNotification = async (req,res)=>{
  try {
    const  notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de notification");
  }
}

const  removeNotification = async (req, res) => {
  try {
    const  notification = await Notification.findByIdAndDelete(req.params.id);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de notification");
  }
}

module.exports = {addNotification,getAllnotifications,getAllnotificationsUser,getOneNotification,updateNotification,removeNotification};