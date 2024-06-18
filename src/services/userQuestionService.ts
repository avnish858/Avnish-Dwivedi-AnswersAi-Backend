import { createQuestion } from '../db/userQueries';
import { Question } from '../interface/question';
const { Anthropic } = require('@anthropic-ai/sdk');
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

export async function generateAnswer(questionText: string): Promise<any> {
  try {
    const answer : any = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [
        
                {"role": "user", "content": "Hello, Claude"},
                {"role": "assistant", "content": "Hello!"},
                {"role": "user", "content": questionText}
        ]
      });
      
    return answer;
    
  } catch (error) {
    console.error('Error generating answer:', error);
    throw new Error('Failed to generate answer');
  }
}

export async function addQuestion(questionText: string, userId: number): Promise<Question | any> {
  console.log("in add q")
  const answer = await generateAnswer(questionText);
  const newQuestion: Question = {
    id: answer.id,
    question: questionText,
    answer: answer.content[0].text.trim(),
  };
const res = await createQuestion(newQuestion,userId);
if(res.success== true){
  console.log("sucesss")
  return newQuestion;
}
else
{
  console.log("else")
  return {data: 'unable to insert the data'}
}
  
}

// export function getQuestionById(questionId: string): Question | undefined {
//   return questions.find((q: any) => q.id === questionId);
// }
