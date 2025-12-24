import express from "express";
import { specific, update } from "../Controller/UserController.js";
import { verifyToken } from "../Middleware/verifyToken.js";
const userRoutes = express.Router();

userRoutes.get("/specific", verifyToken, specific);
userRoutes.put("/update", verifyToken, update);

export default userRoutes;
