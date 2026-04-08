const User = require("../models/User");

//create a new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role, status } = req.body;

        //this is just basic validtion ..ill wait for the one from D_Precious
        if (!password || password.length < 4) {
            return res.status(400).json({ message: "Invalid password" });
        }

        //creating a user object...i also just did a status(active/inactive ) doesnt do much
        const newUser = new User({
            username,
            email,
            password,
            role: role ? role.toLowerCase().trim() : "applicant",
            status: status ? status.toLowerCase().trim() : "active"
        });

        //saving the user to the DB
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all users also with  search and filter
exports.getUsers = async (req, res) => {
    try {
        const { search, role } = req.query;

        let query = {};

        //filter users by role
        if (role) {
            query.role = role.toLowerCase().trim();
        }

        //search by username or email...I included email because it has uniqueness in the search
        //10 people can have same full names
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        //fetch users from db without password for privacy
        const users = await User.find(query).select("-password");

        res.json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get  user by id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        //checking  if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update user role or status
exports.updateUser = async (req, res) => {
    try {
        const { role, status } = req.body;

        const allowedRoles = ["applicant", "provider", "admin"];
        const allowedStatus = ["active", "inactive", "blocked"];

        let updateData = {};

        //validating the role
        if (role !== undefined) {
            const normalizedRole = role.toLowerCase().trim();

            if (!allowedRoles.includes(normalizedRole)) {
                return res.status(400).json({ message: "Invalid role value" });
            }

            updateData.role = normalizedRole;
        }

        //validating the status....still this is not important but i just want to make sure that only valid status is updated
        if (status !== undefined) {
            const normalizedStatus = status.toLowerCase().trim();

            if (!allowedStatus.includes(normalizedStatus)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            updateData.status = normalizedStatus;
        }

        //check if nothing is updated
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided" });
        }

        //update user in db
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//deleting user from system...i suggest changing this to just blocking the user instead of deleting because we might need the data for future reference but for now i will just do delete
exports.deleteUser = async (req, res) => {
    try {

        const id = req.params.id;

        const user = await User.findByIdAndUpdate(id, {
            status: "disabled"
        }, { new: true });

        if (!user) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.json({ message: "User disabled", user: user });
        }

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


