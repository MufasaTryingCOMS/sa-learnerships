const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./common/database');
const Routes = require('./authorization/routes');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./common/models/User');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"
},async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
            if (!profile.name?.givenName && !profile.displayName) {
            throw new Error('Could not extract name from Google profile');
    }
            const firstName = profile.name.givenName || profile.displayName?.split(' ')[0] || 'Google';
            const lastName = profile.name.familyName || profile.displayName?.split(' ')[1] || 'User';
            if (!firstName || firstName === '') {
                throw new Error('First name is required but could not be extracted');
            }
            user = await User.create({
                firstName: firstName,
                lastName: lastName,
                email: profile.emails[0].value,
                googleId: profile.id,
                password: null
            });
            console.log('New user created:', user.email);
        } else if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
            console.log('Google_ID added to existing user:', user.email);
        } else {
            console.log('Existing user logged in:', user.email);
        }
        
        return done(null, user);
    } catch (error) {
        console.error('Google auth error:', error);
        return done(error, null);
    }
}));
passport.serializeUser((user,done) =>done(null, user));
passport.deserializeUser((user,done) =>done(null,user));
app.use('/', Routes);
connectDatabase();

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
