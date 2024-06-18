// src/middlewares/authMiddleware.ts
import { error } from 'console';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = 'this is my secret key';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({error: "You are not authorised to perform this operation"});

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({error: "invaild access token"});
    (req as any).user = user;
    next();
  });
}
