import { Router } from 'express';
import { 
    logoutUser, 
    loginUser, 
    registerUser, 
    getUsers, 
    updateUser, 
    deleteUser ,
    getProfessorsByDepartment
} from '../controllers/user.controller.js';
import { protect } from "../middleware/auth.js";

const router = Router();

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.get("/department/:department", getProfessorsByDepartment);

// Protected routes 
router.route('/getusers').get(protect, getUsers);
router.route('/updateUser/:id').patch(protect, updateUser);


router.route('/deleteUser/:id').delete(protect, deleteUser); 

export default router;