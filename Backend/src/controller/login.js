const { loginValidation } = require("../utils/validate");
const user = require("../models/schema");
const jwt = require("jsonwebtoken");
const { v4:uuidv4 } = require("uuid");
require("dotenv").config();

const login = async (req, res) => {
  try {
    loginValidation(req.body);
    const { email, password } = req.body;
    const u = await user.findOne({ email });
    if (!u) throw new Error("user not exist");
    if (u.email != email) throw new Error("invalid credential");
    const isPasswordValid = await u.comparePassword(password);
    if (!isPasswordValid) throw new Error("invalid credential");
    const token = jwt.sign(
      { sub: u._id, name: u.firstName, email: u.email,role:u.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h",
        jwtid: uuidv4()
      }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send("User login successfully");
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = login;
