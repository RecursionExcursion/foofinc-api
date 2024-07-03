import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

export const tokenAuthHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Unauthorized");

  const secret = process.env.JWT_TOKEN_SECRET;

  if (!secret) return res.status(500).send("Internal Server Error");

  jwt.verify(token, secret, (err) => {
    if (err) {
      const errExp = err as VerifyErrors & { expiredAt: number };

      const errMsg = `Forbidden: ${
        errExp.message + (errExp.expiredAt ? " " + errExp.expiredAt : "")
      }`;

      return res.status(403).send(errMsg);
    }

    next();
  });
};

export const generateAccessToken = (obj: object) => {
  const secret = process.env.JWT_TOKEN_SECRET;
  if (!secret) {
    return null;
  }

  const oneHour = 60 * 60 * 60;

  return jwt.sign(obj, secret, { expiresIn: oneHour });
};
