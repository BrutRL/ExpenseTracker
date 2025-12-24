import { User } from "../Model/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const specific = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const data = await User.findById(userId);
    res.status(200).json({ ok: true, data: data });
  } catch (error) {
    res.status(400).json({ ok: false, message: `Failed to get user` });
  }
};

export const update = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { _id: userId },
      {
        username: username,
        email: email,
        password: hashedPassword,
      },
      { new: true }
    );
    res.status(200).json({ ok: true, message: `User updated successfully` });
  } catch (error) {
    res
      .status(400)
      .json({ ok: false, message: `Failed to update user ${error}` });
  }
};
