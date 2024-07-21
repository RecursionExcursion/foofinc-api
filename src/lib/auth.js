import jwt from "jsonwebtoken";

const getEnvSecret = () => process.env.JWT_TOKEN_SECRET;

export const tokenAuthHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Unauthorized");

  const secret = getEnvSecret();
  if (!secret) return res.status(500).send("Internal Server Error");

  jwt.verify(token, secret, (err) => {
    if (err) {
      const errExp = err;

      const errMsg = `Forbidden: ${
        errExp.message + (errExp.expiredAt ? " " + errExp.expiredAt : "")
      }`;

      return res.status(403).send(errMsg);
    }

    next();
  });
};

export const generateAccessToken = (obj) => {
  const secret = getEnvSecret();

  if (!secret) {
    return null;
  }

  const oneHour = 60 * 60 * 60;

  return jwt.sign(obj, secret, { expiresIn: oneHour });
};
