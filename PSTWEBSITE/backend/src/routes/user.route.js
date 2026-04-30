import { Router } from 'express';
import { logoutUser, loginUser, registerUser, getUsers, updateUser, deleteUser } from '../controllers/user.controller.js';
import { protect } from "../middleware/auth.js";


const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
//router.route('/getusers').get(getUsers);
//router.route('/updateUser/:id').patch(updateUser);
//router.route('/deleteUser/:id').patch(deleteUser);
router.route('/getusers').get(protect, getUsers);
router.route('/updateUser/:id').patch(protect, updateUser);
router.route('/deleteUser/:id').patch(protect, deleteUser);
export default router;