import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret_key = process.env.SECRET_KEY;

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.sendStatus(403); // Forbidden
  }

  jwt.verify(token, secret_key, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = user; // Attach user to request object
    next(); // Move to the next middleware/route handler
  });
};
