import express from 'express';
import {
  updateUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  getUserProfile,
  getMyAppointments,
  bookAppointment,
} from '../Controllers/userController.js';
import { authenticate, restrict } from '../auth/verifyToken.js';
import { protect } from "../middleware/protect.js";

const router = express.Router();

// ✅ Only admin can get all users
router.get('/', authenticate, restrict(['admin']), getAllUser);

// ✅ Patient can fetch their own profile
router.get('/profile/me', authenticate, restrict(['patient']), getUserProfile);

// ✅ Fetch patient's own appointments without requiring ID in the URL
router.get('/get-appointments', authenticate, restrict(['patient']), getMyAppointments);
 // ✅ Fixed route

// ✅ Admin, doctor, or patient can get any single user
router.get('/:id', authenticate, restrict(['admin', 'doctor', 'patient']), getSingleUser);

// ✅ Doctor or patient can update their profile
router.put('/:id', authenticate, restrict(['doctor', 'patient']), updateUser);

// ✅ Only admin can delete a user
router.delete('/:id', authenticate, restrict(['admin']), deleteUser);

// router.post('/book-appointment', authenticate, bookAppointment);

router.post("/book-appointment", protect, bookAppointment);




export default router;
