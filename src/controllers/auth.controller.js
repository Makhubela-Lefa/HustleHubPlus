const bcrypt = require("bcrypt");
const crypto = require("crypto");

const {
    findUserByEmail,
    createUser
} = require("../models/user.model");

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