const User = require('../common/models/User');
const bcryptjs = require('bcryptjs');
const {OAuth2Client} = require('google-auth-library');
const google_id = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(google_id);

require("dotenv").config;
const {isStrong} = require('../../scripts/common_functions');

async function hashPassword(password){
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password,salt);

    return hashedPassword;
}

exports.register = async (req,res) =>{
    try{
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const email = req.body.email;
        const confirmPassword = req.body.confirmPassword;

        const userExists = await User.findOne({email : req.body.email});
        if (userExists){
            return res.status(409).json({error:"User Already Exists!"});

        }

        if (firstName==="" || lastName==="" || email==="" || password==="" || confirmPassword===""){
            return res.status(400).json({error: "Please Fill All The Required Fields!"});
        }

        if (password != confirmPassword){
            return res.status(400).json({error: "Passwords do not match"});
        }

        if (password.length < 8){
            return res.status(400).json({error: "Password length must be at least 8 characters long"});
        }

        if (!isStrong(password)){
            return res.status(400).json({error: "Password is too weak. It must include at least one uppercase letter, one lowercase letter, one digit and one special symbol"});
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            signupMethod: "manual"
        });
        res.status(201).json({
            success:true,
            user: {id:user._id, firstName: user.firstName, lastName: user.lastName, email:user.email}
        });

    }catch(err){
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
}

exports.registerGoogle = async(req,res)=>{
    const google_token = req.body.token;

    try{
        const verifiedToken = await client.verifyIdToken({
            idToken: google_token,
            audience: google_id
        });

        const userInfo = verifiedToken.getPayload();
        const googleId = userInfo.sub;
        const email = userInfo.email;
        const firstName = userInfo.given_name;
        const lastName = userInfo.family_name;

        const userExists = await User.findOne({email});
        if (userExists){
            if (!userExists.googleId){
                userExists.googleId = googleId;
                await userExists.save();
                return res.status(200).json({
                success: true,
                message : "Linked Google Id to existing user",
                user: { id: userExists._id, firstName: userExists.firstName, lastName: userExists.lastName, email: userExists.email}
            });
            }
            else if (userExists.googleId){
                return res.status(400).json({
                    success: false,
                    message : "User And Google Id Already Exist"
                })
            }

        
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            googleId,
            signupMethod: "google"
        });

        return res.status(201).json({
            success:true,
            message: "User registered successfully with Google",
            user: {id:user._id, firstName: user.firstName, lastName: user.lastName, email:user.email}
        });

    }catch(err){
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
}