import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret_key = process.env.SECRET_KEY;

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.sendStatus(403); 
  }

  jwt.verify(token, secret_key, (err, user) => {
    if (err) {
      return res.sendStatus(403); 
    }

    req.user = user;
    next(); 
  });
};
