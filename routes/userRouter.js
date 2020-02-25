const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
const jsonParser = express.json();
const bodyParser = require("body-parser");

// app.use(bodyParser.urlencoded({ extended: false }));

// userRouter.use("/createu", userController.postUser);
userRouter.use("/get_all", userController.getAllUser);
userRouter.post("/create",  userController.createUser);

userRouter.get("/:id", userController.getOneUser);
userRouter.delete("/:id",  userController.deleteUser);




module.exports = userRouter;