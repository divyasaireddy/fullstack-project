import express from 'express';
import {
  bookAppointment,
  cancelAppointment,
  getAllAppointments,
  getMyAppointments,
  getSingleAppointment,
  updateAppointment
} from '../Controllers/userController.js'; // or a dedicated bookingController

import { authenticate, restrict } from '../auth/verifyToken.js';

const router = express.Router();

// Routes for authenticated users
router.post('/', authenticate, bookAppointment);
router.get('/my-appointments', authenticate, getMyAppointments);
router.delete('/:id', authenticate, cancelAppointment);

// Admin or doctor-only routes
router.get('/', authenticate, restrict(['admin', 'doctor']), getAllAppointments);
router.get('/:id', authenticate, restrict(['admin', 'doctor']), getSingleAppointment);
router.put('/:id', authenticate, restrict(['admin', 'doctor']), updateAppointment);

export default router;
