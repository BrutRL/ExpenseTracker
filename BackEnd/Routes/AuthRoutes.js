import express from "express";
import { Register, logout, login } from "../Controller/AuthControlller.js";
import { verifyToken } from "../Middleware/verifyToken.js";
const authRoutes = express.Router();

authRoutes.post("/register", Register);
authRoutes.post("/login", login);
authRoutes.post("/logout", verifyToken, logout);
authRoutes.get("/authorized", verifyToken, (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default authRoutes;
