import express from "express";
import {
  all,
  create,
  update,
  remove,
  transactionCount,
  totalExpense,
  weeklyExpense,
} from "../Controller/TransactionController.js";
import { verifyToken } from "../Middleware/verifyToken.js";
const transactionRoutes = express.Router();
transactionRoutes.get("/all/", verifyToken, all);
transactionRoutes.get("/transaction_count", verifyToken, transactionCount);
transactionRoutes.get("/weekly_expenses", verifyToken, weeklyExpense);
transactionRoutes.get("/total_expenses", verifyToken, totalExpense);
transactionRoutes.post("/create", verifyToken, create);
transactionRoutes.put("/update/:id", verifyToken, update);
transactionRoutes.delete("/delete/:id", verifyToken, remove);
export default transactionRoutes;
