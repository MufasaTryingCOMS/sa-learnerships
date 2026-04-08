const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

//user routes

router.route("/")
  .post(createUser)
  .get(getUsers);   

router.route("/:id")
  .get(getUserById)   
  .put(updateUser)    
  .delete(deleteUser); 

module.exports = router;
