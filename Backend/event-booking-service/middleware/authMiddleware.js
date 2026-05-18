import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token"
      });
    }

    // 🔥 VERIFY TOKEN (same secret as auth-service)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

export default authMiddleware;