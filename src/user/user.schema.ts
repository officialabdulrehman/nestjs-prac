import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
}, {
  timestamps: true
});