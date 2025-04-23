import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

// ⬇️ REGISTER CONTROLLER
export const register = async (req, res) => {
  console.log("🟡 Incoming body:", req.body);
  console.log("🟡 Incoming file:", req.file);

  const { fullName, email, password, role, gender } = req.body;

  if (!fullName || !email || !password || !role || !gender) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email }) || await Doctor.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = role.toLowerCase() === "patient"
      ? new User({ name: fullName, email, password: hashedPassword, gender: gender.toLowerCase(), role: role.toLowerCase(), photo: req.file?.buffer })
      : new Doctor({ name: fullName, email, password: hashedPassword, gender: gender.toLowerCase(), role: role.toLowerCase(), photo: req.file?.buffer });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User successfully registered",
      data: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });

  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ success: false, message: "Internal server error, try again" });
  }
};

// ⬇️ LOGIN CONTROLLER
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }) || await Doctor.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);
    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: userData,
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Failed to login" });
  }
};

// ⬇️ GET USER BY ID CONTROLLER
export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      user = await Doctor.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });

  } catch (error) {
    console.error("GetUserById Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
