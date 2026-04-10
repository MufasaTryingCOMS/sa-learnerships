const express = require("express");
const router = express.Router();

//importing the controllers
const controller = require("./controller"); // for register
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

//authentication routes
router.post("/register", controller.register);
router.post("/registerGoogle", controller.registerGoogle);

//user CRUD routes
router.route("/")
  .post(createUser)
  .get(getUsers);

router.route("/:id")
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
