const {validateRegistration,validateLogin} = require("../middleware/validation.middleware");

const express = require("express");

const router = express.Router();

const {register,login,getMe} = require("../controllers/auth.controller");

const {
    authenticateToken
} = require("../middleware/auth.middleware");


/*
 * Public login endpoint
 * Validates login input before authenticating the user
 */
router.post("/register", validateRegistration, register);


/*
 * Public login endpoint
 *
 * Future structure can become:
 *
 * router.post(
 *     "/login",
 *     authLimiter,
 *     validateLoginInput,
 *     login
 * );
 *
 * without rewriting login()
 */
router.post("/login", validateLogin, login);


/*
 * Protected authenticated-user endpoint
 * A valid JWT must be supplied before getMe is allowed to run
 */
router.get(
    "/me",
    authenticateToken,
    getMe
);


module.exports = router;