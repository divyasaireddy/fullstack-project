import express from 'express';
import { register, login, getUserById } from '../Controllers/authController.js'; // ⬅️ Include getUserById
import { getAllUser } from '../Controllers/userController.js';
import upload from '../middleware/upload.js'; // ✅ Import upload middleware

const router = express.Router();

// ✅ Routes
router.post('/register', upload.single('photo'), register);
router.post('/login', login);
router.get('/users', getAllUser);
router.get('/users/:id', getUserById); // ⬅️ NEW: Fetch user/doctor by ID

export default router;
