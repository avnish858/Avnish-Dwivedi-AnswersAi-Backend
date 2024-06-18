// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, invalidateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils';
import Knex from 'knex';
import knexConfig from '../db/knexfile';

const db = Knex(knexConfig);

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    // Fetch the user from the database
    const users = await db('users')
      .select('*')
      .where('username', username);
    
    // Ensure we have a single user
    if (users.length === 0) {
      return res.status(401).send('Username or password incorrect');
    }

    const user = users[0];

    // Compare the password
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken({ username: user.username });
      const refreshToken = generateRefreshToken({ username: user.username });
      res.json({ accessToken, refreshToken });
    } else {
      res.status(401).send('Username or password incorrect');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
}

export function logout(req: Request, res: Response) {
  const { token } = req.body;
  invalidateRefreshToken(token);
  res.sendStatus(204);
}

export function refresh(req: Request, res: Response) {
  const { token } = req.body;
  try {
    const user = verifyRefreshToken(token);
    const accessToken = generateAccessToken({ username: (user as any).username });
    res.json({ accessToken });
  } catch (err) {
    res.sendStatus(403);
  }
}
