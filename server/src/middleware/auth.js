const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token", token);
  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    console.log("decoded", decoded);
    req.userId = decoded.userID;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ success: false, message: "Invalid token." });
  }
};

module.exports = verifyToken;
