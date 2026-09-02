const bcrypt = require("bcrypt");
const crypto = require("crypto");

const {
    findUserByEmail,
    findUserById,
    createUser
} = require("../models/user.model");

const {
    createAccessToken
} = require("../utils/jwt");

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check that all required fields were provided
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and role are required."
            });
        }

        // Remove extra spaces and convert email to lowercase
        const normalizedEmail = email.trim().toLowerCase();

        // Check whether the email is already registered
        const existingUser = findUserByEmail(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists."
            });
        }

        // Basic password strength check
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long."
            });
        }

        // Only allow the two public account types
        const allowedRoles = ["client", "freelancer"];

        const normalizedRole = role.trim().toLowerCase();

        if (!allowedRoles.includes(normalizedRole)) {
            return res.status(400).json({
                success: false,
                message: "Role must be either client or freelancer."
            });
        }

        //will  securely hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the new user
       const newUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashedPassword,
    role: normalizedRole
};

        // Store the user temporarily
       createUser(newUser);

        //  this returns a safe response without the password/hash
        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred."
        });
    }
};

module.exports = {
    register
};

// USER LOGIN - Person C
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check that both login fields were provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password must be text values."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Await keeps this ready for an asynchronous database lookup
        const user = await findUserByEmail(normalizedEmail);

        // Use a generic response so login does not reveal whether an account exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        // Compare the submitted password with the stored bcrypt hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        //only create a JWT after the user's credentials are verified
        const token = createAccessToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred."
        });
    }
};


// AUTHENTICATED PROFILE - Person C
const getMe = async (req, res) => {
    try {
        //Find  user identified by the verified JWT
        const user = await findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        //Return profile details without exposing the password hash
        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Profile error:", error);

        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred."
        });
    }
};


module.exports = {
    register,
    login,
    getMe
};