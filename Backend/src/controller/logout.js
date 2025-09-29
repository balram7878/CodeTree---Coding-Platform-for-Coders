const logout = (req, res) => {
  try {
    res.cookie("token", null, { expiresIn: new Date().now });
    res.status(200).send("logout successfully");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = logout;
