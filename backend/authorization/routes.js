const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("./controller");

// auth
router.post("/register", controller.register);
router.post("/login", controller.login);

// google auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/"
  }),
  (req, res) => {
    const token = req.user.token;
    res.redirect(`http://localhost:5500/dashboard.html?token=${token}`);
  }
);

// users
router.get("/", controller.getUsers);
router.get("/:id", controller.getUserById);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;
