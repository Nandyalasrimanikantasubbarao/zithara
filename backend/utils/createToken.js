import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // set JWT as an HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "devlopment",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 100,
  });

  return token;
};

export default generateToken;
