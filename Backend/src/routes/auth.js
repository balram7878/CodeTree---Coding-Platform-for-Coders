const express = require("express");
const register = require("../controller/register");
const login = require("../controller/login");
const logout = require("../controller/logout");
const getProfile = require("../controller/getProfile");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/getProfile", getProfile);
