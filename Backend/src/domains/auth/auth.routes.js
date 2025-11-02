const express = require("express");
const authValidation = require("../../middleware/authValidation");
const {
  login,
  logout,
  getProfile,
  adminRegister,
  userRegister,
  deleteProfile,
  authUser,
} = require("./auth.controller");

const router = express.Router();

router.post("/user/register", userRegister);

router.post("/admin/register", authValidation, adminRegister);

router.post("/login", login);

router.post("/logout", authValidation, logout);

router.get("/getProfile", authValidation, getProfile);

router.delete("/delete/profile", authValidation, deleteProfile);

router.get("/authUser",authValidation, authUser);

module.exports = router;
