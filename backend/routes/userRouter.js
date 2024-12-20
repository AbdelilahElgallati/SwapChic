const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/userController");
const Auth = require("../middlewares/auth");

const multer = require("multer");
const storage = multer.memoryStorage(); // Store file in memory as buffer
const upload = multer({ storage });

UserRouter.get( "/", UserController.getAllUsers); 
UserRouter.get( "/:id", UserController.getOneUser); 
UserRouter.put('/changePassword/:id', UserController.changePassword);
// UserRouter.post('/register',upload.single('photo'), UserController.addUser);
UserRouter.post('/register', upload.single('photo'), UserController.addUser);
UserRouter.put('/edit/:id', upload.single('photo'), UserController.updateUser);
UserRouter.put('/editStatus/:id', UserController.updateStausUser);
UserRouter.delete("/remove/:id", UserController.removeUser);
UserRouter.post('/login',Auth, UserController.login);

module.exports = UserRouter;