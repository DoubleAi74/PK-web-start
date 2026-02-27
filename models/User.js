import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: [true, "Firebase UID is required"],
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
  },
  targetDays: {
    type: Number,
    required: [true, "Target days is required"],
    min: [1, "Target days must be at least 1"],
  },
  deadlineMessage: {
    type: String,
    default: "",
  },
  targetDaysSetAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Delete cached model to ensure schema changes are picked up
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", UserSchema);
