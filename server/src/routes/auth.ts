// src/routes/auth.ts
import express from "express";
import User from "../models/User";
import bcrypt from "bcrypt"; // <-- 1. Import bcrypt

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // --- Hashing Logic ---
    // 2. Generate a "salt" - a random string to make the hash more secure
    const salt = await bcrypt.genSalt(10);
    // 3. Hash the password using the salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // ---------------------

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword, // <-- 4. Save the HASHED password
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully!", userId: savedUser._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
