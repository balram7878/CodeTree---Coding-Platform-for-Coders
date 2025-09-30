const express = require("express");
const register = require("../controller/register");
const login = require("../controller/login");
const logout = require("../controller/logout");
const getProfile = require("../controller/getProfile");
const { tokenValidation } = require("../utils/validate");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", tokenValidation, logout);

router.get("/getProfile", getProfile);

module.exports = router;
