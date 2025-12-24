import mongoose from "mongoose";
import { User } from "./UserModel.js";

const BalanceModel = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: User },
  initialBalance: { type: Number, required: true },
  currentBalance: { type: Number },
  history: [
    {
      amount: Number,
      type: { type: String, enum: ["add", "deduct"], default: "add" },
      date: { type: Date, default: Date.now },
    },
  ],
  totalExpense: { type: Number },
  createdAt: { type: Date, default: Date.now() },
});

export const Balance = mongoose.model("Balance", BalanceModel);
