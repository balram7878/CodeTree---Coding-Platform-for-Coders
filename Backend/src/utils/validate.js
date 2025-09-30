const validators = require("validator");
const jwt = require("jsonwebtoken");
const client = require("../config/redis");
require("dotenv").config();

const registrationValidation = ({ firstName, email, password }) => {
  if (!firstName) throw new Error("first name not provided");
  if (firstName.length > 20 || firstName.length < 3)
    throw new Error("first name must be between 3 and 20 characters");

  if (!email) throw new Error("email not provided");
  if (!validators.isEmail(email)) throw new Error("invalid email");
  if (!password) throw new Error("password not provided");
  if (!validators.isStrongPassword(password, { minLength: 8, minSymbols: 0 }))
    throw new Error("password must be stronger (min 8 chars, numbers & letters required)");
};

const loginValidation = ({ email, password }) => {
  if (!email) throw new Error("email not provided");
  if (!password) throw new Error("password not provided");
};

const tokenValidation = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "token missing" });

    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({ error: "server misconfiguration: missing JWT secret" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // If using jti for efficiency
    const isBlocked = await client.exists(`bl:${payload.jti || token}`);
    if (isBlocked) return res.status(401).json({ error: "token has been revoked" });

    req.user = payload;
    req.token=token;
    return next();
  } catch (err) {
    return res.status(401).json({ error: err.message || "Unauthorized" });
  }
};

module.exports = { registrationValidation, loginValidation, tokenValidation };
