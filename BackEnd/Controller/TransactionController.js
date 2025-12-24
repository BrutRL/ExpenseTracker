import { Transaction } from "../Model/TransactionsModel.js";
import { Balance } from "../Model/BalanceModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
export const all = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const data = await Transaction.find({ userId });
    res.status(200).json(data);
  } catch (error) {
    res
      .status(400)
      .json({ ok: false, message: `Failed to get all transaction ${error}` });
  }
};

export const create = async (req, res) => {
  try {
    const { name, category, amount, date, note } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 1. Find balance first
    const balanceDoc = await Balance.findOne({ userId });
    if (!balanceDoc) {
      return res.status(404).json({ message: "Balance record not found" });
    }

    // 2. Check if enough balance
    if (amount > balanceDoc.currentBalance) {
      return res.status(400).json({
        ok: false,
        message: "Transaction amount exceeds available balance",
      });
    }

    // 3. Only create transaction if balance is sufficient
    const transaction = await Transaction.create({
      userId,
      name,
      category,
      amount,
      date,
      note,
    });

    // 4. Update balance
    balanceDoc.totalExpense += amount;
    balanceDoc.currentBalance -= amount;
    balanceDoc.updatedAt = new Date();
    await balanceDoc.save();

    // 5. Respond success
    res.status(201).json({
      ok: true,
      transaction,
      balance: balanceDoc,
      message: "Transaction created successfully",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: `Failed to create transaction: ${error.message}`,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, ...updates } = req.body;

    const oldTx = await Transaction.findById(id);
    if (!oldTx)
      return res.status(404).json({ message: "Transaction not found" });

    const amountParsed = Number(amount);

    if (isNaN(amountParsed)) {
      return res.status(400).json({ message: "Invalid amount value" });
    }
    const diff = amountParsed - oldTx.amount;
    const updatedTx = await Transaction.findByIdAndUpdate(
      id,
      { ...updates, amount: amountParsed },
      { new: true }
    );

    await Balance.updateOne(
      { userId: oldTx.userId },
      {
        $inc: { totalExpense: diff, currentBalance: -diff },
        $set: { updatedAt: new Date() },
      }
    );

    res.status(200).json({
      ok: true,
      transaction: updatedTx,
      message: `Transaction updated successfully`,
    });
  } catch (error) {
    res.status(400).json({ message: `Failed to update transaction: ${error}` });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    await Transaction.deleteOne({ _id: id });

    await Balance.updateOne(
      { userId: tx.userId },
      {
        $inc: { totalExpense: -tx.amount, currentBalance: tx.amount },
        $set: { updatedAt: new Date() },
      }
    );

    res.status(200).json({ ok: true, message: "Transaction deleted" });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Failed to delete transaction: ${error.message}` });
  }
};

export const transactionCount = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: `Unauthenticated` });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const data = await Transaction.find({ userId });
    res.status(200).json(data.length);
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: `Failed to get  user transaction: ${error}`,
    });
  }
};

export const totalExpense = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const data = await Transaction.find({ userId });

    const totalExpense = data.reduce((acc, crr) => acc + crr.amount, 0);
    const balance = await Balance.findOneAndUpdate(
      { userId },
      { totalExpense },
      { new: true }
    );
    await balance.save();
    res.status(200).json(balance.totalExpense);
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: `Failed to get  user toal expenses: ${error}`,
    });
  }
};

export const weeklyExpense = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const result = await Transaction.aggregate([
      // Only match this user's transactions
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      // Group by week using the `date` field
      {
        $group: {
          _id: { $dateTrunc: { date: "$date", unit: "week" } },
          totalWeeklyExpense: { $sum: "$amount" },
        },
      },

      // Sort by week ascending
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: `Failed to compute weekly expenses: ${error.message}`,
    });
  }
};
