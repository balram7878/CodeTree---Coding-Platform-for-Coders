const user = require("../models/schema");
const { registrationValidation } = require("../utils/validate");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const adminRegister = async (req, res) => {
  try {
    if (req.role != "admin")
      return res.status(401).json({ error: "unauthorized user" });

    registrationValidation(req.body);
    const isExist = await user.exists({ email: req.body.email });
    if (isExist) {
      return res.status(409).json({ error: "admin already exists" });
    }
    const { password } = req.body;
    req.body.password = await user.generatePasswordHash(password);
    req.body.role = "admin";
    const u = await user.create(req.body);
    const token = jwt.sign(
      { sub: u._id, name: u.firstName, email: u.email, role: "admin" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h", jwtid: uuidv4() }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("admin registered successfully");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = adminRegister;
