const client = require("../config/redis");

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

module.exports = logout;
