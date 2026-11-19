const express = require('express');

const { UserRegisterController, UserLoginController, UserLogoutController } = require('../controllers/auth.controller');

const router = express.Router();


/* POST /api/auth/register */
router.post("/register", UserRegisterController);

/* POST /api/auth/login */
router.post("/login", UserLoginController);

/**
 * - POST /api/auth/logout
 */
router.post("/logout", UserLogoutController)

module.exports = router;