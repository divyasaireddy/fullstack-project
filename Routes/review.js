import express from 'express';
import { createReview, getAllReviews } from '../Controllers/reviewController.js';
import { authenticate } from '../auth/verifyToken.js';

const router = express.Router();

router.post('/:doctorId/reviews', authenticate, createReview); 
router.get('/reviews', getAllReviews); // ✅ Fixed the route path

export default router;
