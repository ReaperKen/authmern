import Express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import "./database.js";
import User from "./models/userModel.js";
import Message from "./models/msgModel.js";
import env from "dotenv";
import cors from "cors";
import authenticate from "./middlewares/authenticate.js";

env.config({ path: "./config.env" });

const app = Express();

//config

app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(cookieParser());

//home page api

const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("hello world");
});

//Register

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    console.log(newUser);
    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(400).json({ status: "Error " + error });
  }
});

//Login

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
      const isMatch = await bcryptjs.compare(password, user.password);
      if (isMatch) {
        const token = await user.generateToken();
        res.cookie("jwt", token, {
          // Expires Token in 24 Hours
          expires: new Date(Date.now() + 86400000),
          httpOnly: true,
        });
        res.status(200).json("LoggedIn");
      } else {
        res.status(400).json("Invalid Credentials");
      }
    } else {
      res.status(400).json("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).json({ error: "ERROR" });
  }
});

//Contact message

app.post("/api/message", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMSG = new Message({ name, email, message });
    await newMSG.save();
    console.log(newMSG);
    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(400).json({ status: "Error " + error });
  }
});

//Logout
app.get("/api/logout", (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  res.status(200).json({ status: "OK" });
});

//Auth

app.get("/api/auth", authenticate, (req, res) => {
  res.json({ status: "OK" });
});

app.listen(port, () => console.log("server on"));
