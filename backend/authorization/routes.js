const express = require('express');
const passport = require('passport');
const { verifyToken, isAdmin } = require('../middlewares/auth.js');
const controller = require('./controller.js');

const router = express.Router();

// auth
router.post('/register', controller.register);
router.post('/login', controller.login);

// google auth
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/"
  }),
  (req, res) => {
    const token = req.user.token;
<<<<<<< HEAD
    res.redirect(`http://localhost:3000/adminDash.html?token=${token}`);
=======
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false, //we have to change it to true in production
      sameSite: 'Lax',
      maxAge: 3600000
    })
    res.redirect(`${process.env.CLIENT_URL}/home.html`);
>>>>>>> a2c4649ad6b7d7394caebd005660ce5967bf95fc
  }
);
//router.post("/registerGoogle", controller.registerGoogle);

<<<<<<< HEAD
const { verifyToken } = require('../middleware/auth');
router.get('/profile', verifyToken, (req, res) => {
    res.json({ user: req.user });
});
// users

router.get("/", verifyToken, controller.getUsers);
router.get("/:id", verifyToken, controller.getUserById);
router.put("/:id", verifyToken, controller.updateUser);
router.delete("/:id", verifyToken, controller.deleteUser);
=======
router.get('/profile', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

// users
router.get('/', verifyToken,isAdmin, controller.getUsers);
router.get('/:id', controller.getUserById);
router.put('/:id', verifyToken,isAdmin, controller.updateUser);
router.delete('/:id', verifyToken,isAdmin, controller.deleteUser);
>>>>>>> a2c4649ad6b7d7394caebd005660ce5967bf95fc

module.exports = router;
