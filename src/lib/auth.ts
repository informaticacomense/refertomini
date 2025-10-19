import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (pwd: string) => bcrypt.hash(pwd, 12);
export const comparePassword = async (pwd: string, hash: string) => bcrypt.compare(pwd, hash);

export const signJwt = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET || "refertimini_secret", { expiresIn: "7d" });

export const verifyJwt = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET || "refertimini_secret");
