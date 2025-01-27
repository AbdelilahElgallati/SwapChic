const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/userController");
const Auth = require("../middlewares/auth");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

UserRouter.get( "/", UserController.getAllUsers); 
UserRouter.get( "/all", UserController.getAllUsersClerck); 
UserRouter.get( "/clerk/:userId", UserController.getUserById); 
UserRouter.get( "/me", UserController.getUserData); 
UserRouter.get( "/:id", UserController.getOneUser); 
UserRouter.put('/changePassword/:id', UserController.changePassword);
UserRouter.post('/register', upload.single('photo'), UserController.addUser);
UserRouter.put('/edit/:id', upload.single('photo'), UserController.updateUser);
UserRouter.put('/editStatus/:id', UserController.updateStausUser);
UserRouter.delete("/remove/:id", UserController.removeUser);
UserRouter.post('/login',Auth, UserController.login);

module.exports = UserRouter;