import userModel from "../models/users.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();
const secret_key = process.env.SECRET_KEY;

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.json({
        success: false,
        message: "Username already exists. Please choose another one.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 7);
    const user = new userModel({ username, email, password: hashedPassword });
    const savedUser = await user.save();

    if (savedUser) {
      res.json({
        success: true,
        message: "Success",
        user: savedUser,
        token: "123",
      });
    } else {
      res.json({ success: false, message: "Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        interest: user.interest,
        profilePicture: user.profilePicture,
        datejoined: user.datejoined,
      },
      secret_key
    );

    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
