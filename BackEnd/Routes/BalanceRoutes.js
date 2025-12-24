import express from "express";
import {
  specific,
  create,
  update,
  remove,
  userCurrentBalance,
  addBalance,
  getBalanceHistory,
} from "../Controller/BalanceController.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const balanceRoutes = express.Router();

balanceRoutes.get("/specific", verifyToken, specific);
balanceRoutes.get("/current_balance", verifyToken, userCurrentBalance);
balanceRoutes.get("/balance_history", verifyToken, getBalanceHistory);
balanceRoutes.post("/create", verifyToken, create);
balanceRoutes.put("/addBalance", verifyToken, addBalance);
balanceRoutes.put("/update/:id", verifyToken, update);
balanceRoutes.delete("/delete/:id", verifyToken, remove);

export default balanceRoutes;
