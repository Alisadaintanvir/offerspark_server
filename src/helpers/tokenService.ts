import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
  // role: string;
  // permission?: Record<string, string[]>;
  [key: string]: any;
}

// Generate access token
export const generateAccessToken = (payload: TokenPayload): string => {
  //@ts-ignore
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// Save access token in cookie
export const saveAccessTokenInCookie = (res: any, accessToken: string) => {
  res.cookie(process.env.COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });
};

// Verify access token
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};
