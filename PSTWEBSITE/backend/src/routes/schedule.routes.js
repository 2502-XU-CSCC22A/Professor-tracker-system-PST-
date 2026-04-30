import { Router } from 'express';
import { createSchedule, getSchedules, getScheduleByUsername, searchProfessorSchedules, updateSchedule, deleteSchedule } from '../controllers/schedule.controller.js';
import { protect } from "../middleware/auth.js";

const router = Router();

router.route('/public/search').get(searchProfessorSchedules);
router.route('/create').post(protect, createSchedule);
router.route('/getSchedules').get(protect, getSchedules);
router.route('/getSchedules/:username').get(protect, getScheduleByUsername);
router.route('/update/:id').patch(protect, updateSchedule);
router.route('/delete/:id').delete(protect, deleteSchedule);

export default router;
