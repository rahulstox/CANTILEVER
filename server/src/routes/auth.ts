// src/routes/auth.ts
import express from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // <-- 1. Import jsonwebtoken

const router = express.Router();

// ROUTE: POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully!", userId: savedUser._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ROUTE: POST /api/auth/login  <--  NEW ROUTE
router.post("/login", async (req, res) => {
  try {
    // 1. Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 2. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 3. If passwords match, create a JWT
    const payload = {
      userId: user._id,
      name: user.name,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1h" } // Token will be valid for 1 hour
    );

    // 4. Send the token back to the client
    res.status(200).json({
      message: "Logged in successfully!",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
