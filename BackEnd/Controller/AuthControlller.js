import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../Model/UserModel.js";
import { Balance } from "../Model/BalanceModel.js";
import validator from "validator";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
export const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const regexPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!validator.isEmail(email))
      return res.status(400).json({
        message: `Incorrect email format`,
      });
    if (!regexPassword.test(password))
      return res.status(400).json({
        message: `Password must be 8 characters long and have number and special character`,
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    const newBalance = new Balance({
      userId: newUser._id,
      initialBalance: 0,
      currentBalance: 0,
      totalExpense: 0,
    });

    await newBalance.save();

    res.status(200).json({ ok: true, message: ` Register Succefull` });
  } catch (error) {
    res.status(400).json({ message: `Failed to register:${error}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "User does not exist" });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      return res
        .status(401)
        .json({ ok: false, message: "Password is incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "30d" : "3h" } // longer expiry if rememberMe
    );

res.cookie("token", token, {
  httpOnly: true,
  secure: true,          // REQUIRED on Render (HTTPS)
  sameSite: "None",      // REQUIRED for cross-site cookies
  maxAge: rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 3 * 60 * 60 * 1000,
});


    return res
      .status(200)
      .json({ ok: true, message: "Login successful", token: token });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: `Failed to login: ${error.message}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ ok: true, message: `Logout Successfully` });
  } catch (error) {
    res.status(400).json({ ok: false, message: `Failed to logout:${error}` });
  }
};
