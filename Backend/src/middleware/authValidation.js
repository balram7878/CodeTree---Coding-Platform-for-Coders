const jwt = require("jsonwebtoken");
const client = require("../config/redis");

const tokenValidation = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "token missing" });
    if (!process.env.JWT_SECRET_KEY) {
      return res
        .status(500)
        .json({ error: "server misconfiguration: missing JWT secret" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // If using jti for efficiency
    const isBlocked = await client.exists(`bl:${payload.jti || token}`);
    if (isBlocked)
      return res.status(401).json({ error: "token has been revoked" });

    req.user = payload;
    req.token = token;
    req.role = payload.role;
    return next();
  } catch (err) {
    return res.status(401).json({ error: err.message || "Unauthorized" });
  }
};

module.exports = tokenValidation;
