const jwt = require("jsonwebtoken");

const JWT_ALGORITHM = "HS256";


//Reads the JWT secret from the environment
//The secret is never hard-coded in source code and must not be committed to GitHub
 
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error(
            "JWT_SECRET must be configured with at least 32 characters."
        );
    }

    return secret;
};

//Creates an access token for an authenticated HustleHub+ user
//Only the information required for authentication/authorisation is placed inside the payload.
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


//Verifies a JWT received from a protected request

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