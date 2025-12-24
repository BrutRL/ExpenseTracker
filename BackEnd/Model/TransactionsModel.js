import mongoose, { Types } from "mongoose";
import { User } from "./UserModel.js";
const TransactionSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: User },
  name: { type: String, required: true, maxlength: 50 },
  category: { type: String, maxlength: 50, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  note: { type: String, maxlength: 100 },
  createdAt: { type: Date, default: Date.now() },
});

export const Transaction = mongoose.model("Transactions", TransactionSchema);
