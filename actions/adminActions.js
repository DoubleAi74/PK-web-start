"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function getAllUsers() {
  try {
    await dbConnect();

    const users = await User.find({}).sort({ createdAt: -1 });

    console.log("getAllUsers - raw users from DB:", users.map(u => ({
      id: u._id.toString(),
      email: u.email,
      deadlineMessage: u.deadlineMessage,
      deadlineDate: u.deadlineDate,
    })));

    return {
      success: true,
      users: users.map((user) => ({
        id: user._id.toString(),
        firebaseUid: user.firebaseUid,
        email: user.email,
        targetDays: user.targetDays,
        deadlineMessage: user.deadlineMessage || "",
        targetDaysSetAt: user.targetDaysSetAt ? user.targetDaysSetAt.toISOString() : null,
        createdAt: user.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch users",
    };
  }
}

export async function deleteUser(userId) {
  try {
    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return { success: false, error: "User not found" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error.message || "Failed to delete user",
    };
  }
}

export async function updateUserTargetDays(userId, targetDays, deadlineMessage) {
  try {
    await dbConnect();

    console.log("updateUserTargetDays called with:", { userId, targetDays, deadlineMessage });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          targetDays: parseInt(targetDays, 10),
          deadlineMessage: deadlineMessage || "",
          targetDaysSetAt: new Date(),
        },
      },
      { new: true, strict: false }
    );

    console.log("Updated user result:", updatedUser);

    if (!updatedUser) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      user: {
        id: updatedUser._id.toString(),
        targetDays: updatedUser.targetDays,
        deadlineMessage: updatedUser.deadlineMessage || "",
      },
    };
  } catch (error) {
    console.error("Error updating user target days:", error);
    return {
      success: false,
      error: error.message || "Failed to update target days",
    };
  }
}
