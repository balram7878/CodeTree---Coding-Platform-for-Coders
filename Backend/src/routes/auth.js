const express = require("express");
const userRegister = require("../controller/userRegister");
const login = require("../controller/login");
const logout = require("../controller/logout");
const getProfile = require("../controller/getProfile");
const tokenValidation  = require("../middleware/tokenValidation");
const adminRegister=require("../controller/adminRegister");


const router = express.Router();

router.post("/user/register", userRegister);

router.post("/admin/register",tokenValidation,adminRegister);

router.post("/login", login);

router.post("/logout", tokenValidation, logout);

router.get("/getProfile",tokenValidation, getProfile);


module.exports = router;
