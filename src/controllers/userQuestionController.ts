import { Request, Response } from 'express';
import { addQuestion } from '../services/userQuestionService';
import { User } from '../interface/user';
import bcrypt from 'bcryptjs';

import { createUser, findUserByEmail, findUserById, findUserByUsername, getQuestionById, getQuestionbyUserId } from '../db/userQueries';

export async function postQuestion(req: Request, res: Response) {
  try {
    const question = req.body.question;
    const username = (req as any).user.username;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
const userId : any = await findUserByUsername(username);
    const newQuestion = await addQuestion(question,userId.id);
    console.log("ress",newQuestion)
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export async function getQuestion(req: Request, res: Response) {
  const { questionId } = req.params;
  const question = await getQuestionById(questionId);

  if (!question) {
    return res.status(404).json({ error: 'no Question found for given user' });
  }

  res.status(200).json(question);
}

export async function getQuestionByUserId(req: Request, res: Response) {
  console.log("inf")
  const  userId  =parseInt(req.params.id);
  const question = await getQuestionbyUserId(userId);

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  res.status(200).json(question);
}
export async function registerUser(req: Request, res: Response): Promise<User | any> {
  // Check if username or email already exists
  const {username , email, password} = req.body
  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    return res.status(400).json({ error: 'Email already exists' });
    
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser: Partial<User> = {
    username,
    email,
    password: hashedPassword
  };

  const createdUser = await createUser(newUser);
  return res.status(200).json(createdUser)
}

export async function getUserById(req: Request, res: Response) {
  console.log("infuxniton")
  const userId = parseInt(req.params.id);
  console.log(req.params)
  const user = await findUserById(userId);

  if (!user) {
    return res.status(404).json({ error: 'user not found' });
  }

  return res.status(200).json(user);
}