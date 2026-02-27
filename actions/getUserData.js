"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function createUserRecord(firebaseUid, email, targetDays) {
  try {
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    // Create new user record
    const user = await User.create({
      firebaseUid,
      email,
      targetDays: parseInt(targetDays, 10),
    });

    return {
      success: true,
      user: {
        id: user._id.toString(),
        firebaseUid: user.firebaseUid,
        email: user.email,
        targetDays: user.targetDays,
        createdAt: user.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error creating user record:", error);
    return {
      success: false,
      error: error.message || "Failed to create user record",
    };
  }
}

export async function getUserData(firebaseUid) {
  try {
    await dbConnect();

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        firebaseUid: user.firebaseUid,
        email: user.email,
        targetDays: user.targetDays,
        deadlineMessage: user.deadlineMessage || "",
        targetDaysSetAt: user.targetDaysSetAt ? user.targetDaysSetAt.toISOString() : null,
        createdAt: user.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch user",
    };
  }
}
