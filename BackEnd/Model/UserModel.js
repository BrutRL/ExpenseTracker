import mongoose from "mongoose";
const UserSchema = mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, unique: true, maxlength: 50 },
  password: { type: String, required: true, minlength: 8 },
  createdAt: { type: Date, default: Date.now() },
});

export const User = mongoose.model("User", UserSchema);
