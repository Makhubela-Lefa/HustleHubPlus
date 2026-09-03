const express = require("express");

const router = express.Router();

const {
    register,
    login,
    getMe
} = require("../controllers/auth.controller");

const {
    authenticateToken
} = require("../middleware/auth.middleware");


/*
 * Public registration endpoint
 * Person D can later insert registration validation middleware before the controller without changing the controller itself.
 */
router.post(
    "/register",
    register
);


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
router.post(
    "/login",
    login
);


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