const user = require("../models/schema");
const {registrationValidation} = require("../utils/validate");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  try {
    registrationValidation(req.body);
    const {password}=req.body;
    req.body.password = await user.generatePasswordHash(password);
    user.create(req.body);
    const token = jwt.sign(
      { name: req.body.firstName, email: req.body.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("user registered successfully");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = register;
