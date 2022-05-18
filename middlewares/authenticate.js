import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config({ path: "../config.env" });

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ status: "No token" });
    } else {
      const verifyToken = jwt.verify(token, process.env.SECRET);
      const rootUser = await User.findOne({
        _id: verifyToken._id,
        "tokens.token": token,
      });

      if (!rootUser) {
        res.status(401).json({ status: "User not found" });
      } else {
        res.status(200).json({ status: "OK" });
      }
    }
    next();
  } catch (error) {
    res.status(401).json({ status: "ERROR" });
    console.log(error);
  }
};
export default authenticate;
