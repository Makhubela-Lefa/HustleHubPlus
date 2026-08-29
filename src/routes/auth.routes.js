const express = require('express');

const router = express.Router();

const express = require("express");

const router = express.Router();

const { register } = require("../controllers/auth.controller");

/*
 * PERSON B:
 * POST /register
 */
router.post("/register", register);

/*
 * PERSON C:
 * Add POST /login here using the login controller.
 *
 * Keep route logic thin. Business/authentication logic should live
 * in controllers/services rather than directly in this file.
 */

module.exports = router;
 