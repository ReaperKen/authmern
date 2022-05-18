import mongoose from "mongoose";
import env from "dotenv";

env.config({ path: "./config.env" });

const db = process.env.MONGODB;

const connect = async () => {
  await mongoose
    .connect(db)
    .then(() => console.log("Connected"))
    .catch((e) => console.log("error " + e));
};
connect();
