// src/utils/tokenUtils.ts
import jwt from 'jsonwebtoken';

const secretKey = 'this is my secret key';
const refreshTokens: string[] = [];

export function generateAccessToken(user: any) {
  return jwt.sign(user, secretKey, { expiresIn: '15m' });
}

export function generateRefreshToken(user: any) {
  const refreshToken = jwt.sign(user, secretKey);
  refreshTokens.push(refreshToken);
  return refreshToken;
}

export function invalidateRefreshToken(token: string) {
  const index = refreshTokens.indexOf(token);
  if (index > -1) {
    refreshTokens.splice(index, 1);
  }
}

export function verifyRefreshToken(token: string) {
  if (!refreshTokens.includes(token)) {
    throw new Error('Invalid refresh token');
  }
  return jwt.verify(token, secretKey);
}
