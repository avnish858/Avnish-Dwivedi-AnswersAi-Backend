import Knex from 'knex';
import knexConfig from './knexfile';
import { User } from '../interface/user';
import { Question } from '../interface/question';

const db = Knex(knexConfig);

export async function createUser(user: Partial<User>): Promise<User | any> {
  return await db.transaction(async trx => {
    // Insert the user data
    await trx('users').insert(user);

    // Fetch the inserted user data based on a unique attribute (e.g., username)
    const createdUser = await trx<User>('users').where('username', user.username).first();

    if (!createdUser) {
      throw new Error('User not found after insertion');
    }
console.log(createdUser)
    return createdUser;
  });
}
export async function findUserById(userId: number): Promise<User | undefined> {
  return db<User>('users').where('id',userId).first();
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
  return db<User>('users').where({ username }).first();
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return db<User>('users').where({ email }).first();
}
export async function createQuestion(newQuestion : Question,userId: number): Promise< any> {
  try {
console.log(userId)
   const res = await db('questions').insert({
      id: newQuestion.id,
      question: newQuestion.question,
      answer: newQuestion.answer,
      user_id: userId
    });
    console.log("db ressss",res)

    return {success: true}

  } catch (error) {
    console.log(error)
    throw new Error('not able insert question');
  }

}
export async function getQuestionById(questionId: string): Promise<Question | undefined> {
  return db<Question>('questions').where('id' ,questionId ).first();
}


export async function getQuestionbyUserId(userId: number): Promise<any | undefined> {
  return db<any>('questions').select('*').where('user_id' ,userId )
}
