import { Router } from 'express';
import { postQuestion,  registerUser, getUserById, getQuestion, getQuestionByUserId } from '../controllers/userQuestionController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
router.post('/questions', authenticateToken, postQuestion);
router.get('/questions/:questionId', authenticateToken,getQuestion );
router.post('/users',registerUser )
router.get('/users/:id',authenticateToken,getUserById)
router.get('/users/:id/questions',authenticateToken,getQuestionByUserId)
export default router;
