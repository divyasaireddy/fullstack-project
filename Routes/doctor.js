import express from 'express'
import { updateDoctor, deleteDoctor, getAllDoctor, getSingleDoctor, getDoctorProfile } from '../Controllers/doctorController.js'
import { authenticate, restrict } from '../auth/verifyToken.js';

import reviewRouter from './review.js'

const router = express.Router()

// nested route
router.use('/:doctorId/reviews',reviewRouter)

router.get('/', getAllDoctor); // ✅ Fetch all Doctors
router.get('/:id', getSingleDoctor); // ✅ Fetch a single Doctor by ID
router.put('/:id',authenticate,restrict(["doctor"]), updateDoctor); // ✅ Update Doctor by ID
router.delete('/:id',authenticate,restrict(["doctor"]), deleteDoctor); // ✅ Delete user by ID

router.get('/profile/me',authenticate,restrict(['doctor']),getDoctorProfile)

export default router
