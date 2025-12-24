import { Balance } from "../Model/BalanceModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const specific = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: `Unauthenticated` });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const data = await Balance.findOne({ userId });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: `Failed to get Balance${error}` });
  }
};

export const userCurrentBalance = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: `Unauthenticated` });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const data = await Balance.findOne({ userId });

    res.status(200).json(data.currentBalance);
  } catch (error) {
    res.status(400).json({ message: `Failed to get user Balance${error}` });
  }
};
export const create = async (req, res) => {
  try {
    const { initialBalance, totalExpense } = req.body;

    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    if (initialBalance <= 0)
      return res
        .status(400)
        .json({ message: `Balance must be not lower than zero` });

    const currentBalance = initialBalance;
    const newBalance = new Balance({
      userId: userId,
      initialBalance: initialBalance,
      currentBalance: currentBalance,
      totalExpense: totalExpense,
    });

    await newBalance.save();
    res.status(200).json({ message: `Balance created successfully` });
  } catch (error) {
    res.status(400).json({ message: `Failed to create Balance${error}` });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, initialBalance, currentBalance, totalExpense } = req.body;
    const updateBalance = await Balance.findByIdAndUpdate(id, {
      userId: userId,
      initialBalance: initialBalance,
      currentBalance: currentBalance,
      totalExpense: totalExpense,
    });

    await updateBalance.save();
    res.status(200).json({ message: `Balance updated successfully` });
  } catch (error) {
    res.status(400).json({ message: `Failed to update Balance${error}` });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Balance.findByIdAndDelete({ id });
    res.status(200).json({ message: `Balance deleted successfully` });
  } catch (error) {
    res.status(400).json({ message: `Failed to delete Balance${error}` });
  }
};

export const addBalance = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { currentBalance } = req.body;
    if (currentBalance < 0)
      return res
        .status(400)
        .json({ message: "Balance must be greater than 0" });
    const updatedBalance = await Balance.findOneAndUpdate(
      { userId },
      {
        $inc: { currentBalance: Number(currentBalance) },
        $push: {
          history: {
            amount: currentBalance,
            type: "add",
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedBalance) {
      return res.status(404).json({ message: "Balance record not found" });
    }

    res.status(200).json({
      ok: true,
      message: "Balance updated successfully",
      balance: updatedBalance,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: `Failed to update user balance: ${error}`,
    });
  }
};

export const getBalanceHistory = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const balance = await Balance.findOne({ userId }).select("history");

    if (!balance) {
      return res.status(404).json({ message: "Balance record not found" });
    }
    res.status(200).json({ ok: true, message: balance.history });
  } catch (error) {
    res
      .status(400)
      .json({ ok: false, message: `Failed to fetch history: ${error}` });
  }
};
