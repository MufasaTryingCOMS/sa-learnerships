const User = require('../common/models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const google_id = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(google_id);

const { isStrong } = require('../../scripts/common_functions.js');

//generate jwt token with user details
function generateAccessToken(email, userId, role) {
    const secret = process.env.JWT_SECRET || 'your_secret_key_here';

    return jwt.sign(
        { email, userId, role },
        secret,
        { expiresIn: '24h' }
    );
}

//hash password before saving to db
async function hashPassword(password) {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

//register normal user (manual signup)
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(409).json({ error: "User Already Exists!" });
        }

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "Please Fill All The Required Fields!" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        if (!isStrong(password)) {
            return res.status(400).json({
                error: "Password must include uppercase, lowercase, number and special character"
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            signupMethod: "manual",
            role: "applicant"
        });

        return res.status(201).json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

//login user (manual login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (!userExists) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        //block google-only users from manual login
        if (!userExists.password) {
            return res.status(401).json({ error: "Use Google login" });
        }

        const isPasswordValid = await bcryptjs.compare(password, userExists.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const token = generateAccessToken(
            userExists.email,
            userExists._id,
            userExists.role
        );

        return res.status(200).json({
            success: true,
            user: {
                id: userExists._id,
                firstName: userExists.firstName,
                lastName: userExists.lastName,
                email: userExists.email,
                role: userExists.role
            },
            token
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

//google signup / login
exports.registerGoogle = async (req, res) => {
    const google_token = req.body.token;

    try {
        const verifiedToken = await client.verifyIdToken({
            idToken: google_token,
            audience: google_id
        });

        const userInfo = verifiedToken.getPayload();

        const googleId = userInfo.sub;
        const email = userInfo.email;
        const firstName = userInfo.given_name;
        const lastName = userInfo.family_name;

        let user = await User.findOne({ email });

        //if user already exists
        if (user) {

            //link google id if not linked yet
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }

            const token = generateAccessToken(user.email, user._id, user.role);

            return res.status(200).json({
                success: true,
                message: "Google account linked",
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            });
        }

        //create new google user
        user = await User.create({
            firstName,
            lastName,
            email,
            googleId,
            signupMethod: "google",
            role: "applicant"
        });

        const token = generateAccessToken(user.email, user._id, user.role);

        return res.status(201).json({
            success: true,
            message: "Google signup successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

//soft delete user (disable instead of removing from DB)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: "disabled" },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: "User disabled", user });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

//update user role or status
exports.updateUser = async (req, res) => {
    try {
        const { role, status } = req.body;

        const allowedRoles = ["applicant", "provider", "admin"];
        const allowedStatus = ["active", "inactive", "disabled"];

        let updateData = {};

        //update role if provided
        if (role !== undefined) {
            const normalizedRole = role.toLowerCase().trim();

            if (!allowedRoles.includes(normalizedRole)) {
                return res.status(400).json({ message: "Invalid role value" });
            }

            updateData.role = normalizedRole;
        }

        //update status if provided
        if (status !== undefined) {
            const normalizedStatus = status.toLowerCase().trim();

            if (!allowedStatus.includes(normalizedStatus)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            updateData.status = normalizedStatus;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(updatedUser);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

//get all users with optional search and filtering
exports.getUsers = async (req, res) => {
    try {
        const { search, role } = req.query;

        let query = {};

        if (role) {
            query.role = role.toLowerCase().trim();
        }

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const users = await User.find(query).select("-password");

        return res.json(users);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

//get single user by id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(user);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
