import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
  // role: string;
  // permission?: Record<string, string[]>;
}

// Generate access token
export const generateAccessToken = (payload: TokenPayload): string => {
  const { exp, ...cleanPayload } = payload as any;
  //@ts-ignore
  return jwt.sign(cleanPayload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// Verify access token
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};

// Generate refresh token
export const generateRefreshToken = (payload: TokenPayload): string => {
  const { exp, ...cleanPayload } = payload as any;
  //@ts-ignore
  return jwt.sign(cleanPayload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

// Save refresh token in cookie
export const saveRefreshTokenInCookie = (res: any, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

// Verify refresh token
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as TokenPayload;
};
