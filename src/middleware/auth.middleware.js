const {
    verifyAccessToken
} = require("../utils/jwt");


//Verify JWTs before allowing access to protected routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //Protected requests must use: Authorization: Bearer <token>
    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {
        return res.status(401).json({
            success: false,
            message: "Authentication token is required."
        });
    }

    const token = authHeader
        .slice("Bearer ".length)
        .trim();

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication token is required."
        });
    }

    try {
        //Verify the token signature, secret, algorithm and expiration
        const decoded = verifyAccessToken(token);

        //valid HustleHub+ tokens must contain the user's id and role
        if (!decoded.id || !decoded.role) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired authentication token."
            });
        }

        //make the authenticated user's identity available to later middleware and controllers
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        return next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token."
        });
    }
};


//Restrict authenticated users to the roles allowed for a route
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication is required."
            });
        }

        // Authenticated users without the required role are denied access
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        return next();
    };
};


module.exports = {
    authenticateToken,
    authorizeRoles
};