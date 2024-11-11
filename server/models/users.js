import { Schema, model } from "mongoose";

// write schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  interest: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  datejoined: {
    type: Date,
    default: Date.now,
  },
});

const userModel = model("users", UserSchema);

export default userModel;
