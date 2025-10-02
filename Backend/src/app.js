const express = require("express");
const main = require("./config/db");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/auth");
const client = require("./config/redis");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth",userRouter);


const initializeConnection = async () => {
  try {
    await Promise.all([main(), client.connect()]);
    console.log("Databases connected");
    app.listen(process.env.PORT, () => {
      console.log("server listen at port: ", process.env.PORT);
    });
  } catch (err) {
    throw err;
  }
};

initializeConnection();
