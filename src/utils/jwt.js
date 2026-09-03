const jwt = require("jsonwebtoken");

const JWT_ALGORITHM = "HS256";

// Get JWT secret from the environment instead of hard-coding it
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    // Require a sufficiently long secret for safer token signing
    if (!secret || secret.length < 32) {
        throw new Error(
            "JWT_SECRET must be configured with at least 32 characters."
        );
    }

    return secret;
};

// Create an access token containing only the user's required identity details
const createAccessToken = (user) => {
    if (!user || !user.id || !user.role) {
        throw new Error(
            "A JWT cannot be created without a user id and role."
        );
    }

    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        getJwtSecret(),
        {
            algorithm: JWT_ALGORITHM,
            expiresIn: process.env.JWT_EXPIRES_IN || "1h"
        }
    );
};

// Verify that a token is valid and was signed using the expected settings

const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        getJwtSecret(),
        {
            algorithms: [JWT_ALGORITHM]
        }
    );
};

module.exports = {
    createAccessToken,
    verifyAccessToken
};