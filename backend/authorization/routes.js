const express = require('express');
const controller = require('./controller');
const router = express.Router();
const passport = require('passport');

router.post('/register', controller.register);
router.post('/login', controller.login);

//login with google
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'],rompt: 'select_account' })
);
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    (req, res) => {
        const token = req.user.token;
        res.redirect(`http://localhost:5500/dashboard.html?token=${token}`);
    }
);



module.exports = router;