import { model, Schema } from "mongoose";
import { DTOCreate } from "../datamodels/dto";
import { User } from "./entities/user.entity";

export interface UserDocI extends DTOCreate<User>, Document { }

export const UserSchema = new Schema({
  name: String,
  age: Number,
}, {
  timestamps: true
});

export const UserModel = model<UserDocI>("User", UserSchema);