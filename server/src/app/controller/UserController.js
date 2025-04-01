require("dotenv").config();
const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
class UserController {
  //[GET] /api/auth
  index(req, res) {
    const userId = req.userId;
    User.findById(userId)
      .select("-password")
      .then(function (user) {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ success: true, user });
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      });
  }
  // [GET] /api/authAdmin
  indexAdmin(req, res) {
    const userId = req.userId;
    User.findById(userId)
      .select("-password")
      .then(function (user) {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ success: true, user });
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }); //
  }
  // [GET] /api/auth/all
  getAllUsers(req, res) {
    User.find({})
      .then((users) => res.json(users)) // ✅ Return list user
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "L��i server" });
      });
  }
  //[POST] /api/auth/register
  async register(req, res) {
    const { username, password, email, fullName, phone, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Missing username and/or password" });
    }
    try {
      //Check for existing user
      const user = await User.findOne({ username });

      const emailExit = await User.findOne({ email });
      if (user) return res.status(400).json({ success: false, message: "Username already taken" });
      if (emailExit) {
        return res.status(400).json({ success: false, message: "Email already taken" });
      }
      // All good
      const hashedPassword = await argon2.hash(password);
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        fullName,
        phone,
        role,
      });
      await newUser.save();

      //Return JWT token
      const accessToken = jwt.sign(
        { userID: newUser._id, role: newUser.role },
        process.env.ACCESS_TOKEN,
        { expiresIn: "100h" }
      );
      res.json({
        success: true,
        message: "User created successfully",
        accessToken,
      });
    } catch (err) {
      console.error(err);
    }
  }

  //[POST] /api/auth/login
  async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Missing username and/or password" });
    }
    try {
      //Check for existing user
      const user = await User.findOne({ username });
      if (!user)
        return res.status(400).json({
          success: false,
          message: "Incorrect username or password",
        });
      // Username found
      const passwordValid = await argon2.verify(user.password, password);
      if (!passwordValid) {
        return res.status(400).json({
          success: false,
          message: "Incorrect username or password",
        });
      }
      // All good
      //Return JWT token
      const accessToken = jwt.sign(
        { userID: user._id, role: user.role },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "100h",
        }
      );
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      console.log("Decoded JWT:", decoded);
      res.json({
        success: true,
        message: "Login successful",
        accessToken,
        role: user.role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
  // [POST] /api/auth/loginAdmin
  async loginAdmin(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Missing username and/or password" });
    }
    try {
      //Check for existing user
      const user = await User.findOne({ username, role: "admin" });
      if (!user)
        return res.status(400).json({
          success: false,
          message: "Incorrect username or password",
        });
      // Username found
      const passwordValid = await argon2.verify(user.password, password);
      if (!passwordValid) {
        return res.status(400).json({
          success: false,
          message: "Incorrect username or password",
        });
      }
      // All good
      //Return JWT token
      const accessToken = jwt.sign(
        { userID: user._id, role: user.role },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "100h",
        }
      );
      res.json({
        success: true,
        message: "Login Admin successful",
        accessToken,
        role: user.role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
}
module.exports = new UserController();
