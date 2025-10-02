const user = require("../models/schema");
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

module.exports = getProfile;
