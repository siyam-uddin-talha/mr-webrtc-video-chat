const express = require('express');
const router = express.Router()

const { LOGIN, REGISTER_NEW_USER, LOG_OUT } = require('../Auth/app');
const ResetThePassword = require('../Auth/resetThePasword');
const UserForgetPassword = require('../Auth/userForgetPassword');

router.route("/login").post(LOGIN)
router.route("/register").post(REGISTER_NEW_USER)
router.route("/logout").get(LOG_OUT)
router.route("/reset/password/:resetToken").post(ResetThePassword)
router.route("/forget/password").post(UserForgetPassword)

module.exports = router;