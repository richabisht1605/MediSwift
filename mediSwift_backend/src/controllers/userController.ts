import { Request, Response } from "express";
import { User } from "../models/User";

// ✅ Register Controller
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      address,
      role,
      ambulanceName,
      ambulanceNumber,
      hasMedicalTraining,
      imageUrl,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered." });
    }

    // Create user based on role
    const newUser = new User({
      fullName,
      phoneNumber,
      email,
      address,
      role,
      ...(role === "Rider" && {
        ambulanceName,
        ambulanceNumber,
        hasMedicalTraining,
        imageUrl,
      }),
    });

    await newUser.save();

    return res.status(201).json({
      message: "Registration successful.",
      data: newUser,
    });
  } catch (error: any) {
    console.error("Error in registerUser:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};
