import mongoose from "mongoose";
const { Schema, model } = mongoose;

const msgSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

export default model("MESSAGE", msgSchema);
