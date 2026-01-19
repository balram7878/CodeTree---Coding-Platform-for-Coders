const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
    },
    dob: {
      type: Date,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    problemSolved: [
      {
        type: [],
      },
    ],
  },
  { timestamps: true },
);

userSchema.statics.generatePasswordHash = async function (password) {
  try {
    return await bcrypt.hash(password, 10);
  } catch (err) {
    throw err;
  }
};
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

// userSchema.post("findOneAndDelete", async (userInfo) => {
//   if (userInfo)
//     mongoose.model("Submission").deleteMany({ userId: userInfo._id });
// });

const User = mongoose.model("User", userSchema);

module.exports = User;

//bcwtf
