const express = require('express');
const controller = require('./controller');
const router = express.Router();
const passport = require('passport');
router.post('/register', controller.register);
router.post('/login', controller.login);

//login with google
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);



module.exports = router;