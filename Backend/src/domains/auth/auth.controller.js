const { loginValidation } = require("../../utils/validate.user");
const { registrationValidation } = require("../../utils/validate.user");
const client = require("../../config/redis");
const user = require("../../models/User.model");
const submission_model = require("../../models/Submission.model");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const getProfile = async (req, res) => {
  try {
    const { email } = req.user;
    // if(!email) res.status(401).json({error:"email not provided"});
    const u = await user.findOne({ email });
    if (!u) return res.status(401).json({ error: "user not found" });
    res.status(200).json(u);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.sub;
    if (!userId) return res.status(404).json({ message: "user not found" });
    const u = await user.findByIdAndDelete(userId);
    if (!u) return res.status(404).json({ message: "User not found" });
    const submission = await submission_model.deleteMany({ userId });
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" + err.message });
  }
};

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
      { sub: u._id, name: u.firstName, email: u.email, role: u.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h", jwtid: uuidv4() }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).json({
      firstName: u.firstName,
      email: u.email,
      status: "login successfully",
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    await client.set(`bl:${req.user.jti || req.token}`, "blocked");
    await client.expireAt(`bl:${req.user.jti || req.token}`, req.user.exp);
    res.cookie("token", null, { expiresIn: new Date(Date.now()) });
    res.status(200).send("logout successfully");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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

    await user.create(req.body);
    // const token = jwt.sign(
    //   { sub: u._id, name: u.firstName, email: u.email, role: u.role },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: "1h", jwtid: uuidv4() }
    // );
    // res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("admin registered successfully");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const userRegister = async (req, res) => {
  try {
    registrationValidation(req.body);
    const isExist = await user.exists({ email: req.body.email });
    if (isExist) {
      return res.status(409).json({ error: "User already exists" });
    }
    const { password } = req.body;
    req.body.password = await user.generatePasswordHash(password);
    req.body.role = "user";
    const u = await user.create(req.body);
    const token = jwt.sign(
      { sub: u._id, name: u.firstName, email: u.email, role: u.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h", jwtid: uuidv4() }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      firstName: u.firstName,
      email: u.email,
      message: "user registered successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const authUser = async (req, res) => {
  res.status(200).json({
    firstName: req.user.firstName,
    email: req.user.email,
    message: "authenticated user",
  });
};

module.exports = {
  login,
  logout,
  getProfile,
  userRegister,
  adminRegister,
  deleteProfile,
  authUser,
};
