import express from "express";
import cookieParser from "cookie-parser";
import DbConnection from "./DbConnection/Connection.js";
import authRoutes from "./Routes/AuthRoutes.js";
import balanceRoutes from "./Routes/BalanceRoutes.js";
import transactionRoutes from "./Routes/TransactionRoutes.js";
import userRoutes from "./Routes/UserRoutes.js";
import multer from "multer";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const Port = process.env.PORT || 3000;
const upload = multer();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});

await DbConnection();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(upload.array());
app.use(limiter);
app.use("/auth", authRoutes);
app.use("/balance", balanceRoutes);
app.use("/transaction", transactionRoutes);
app.use("/user", userRoutes);
app.listen(Port, () => {
  console.log(`Server is running at Port: ${Port}`);
});
