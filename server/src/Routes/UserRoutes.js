import express from "express";
import { deleteUser, Login, requestotp, user, userProfile } from "../Controllers/UserController.js";
import { authMiddleware, onlyUser } from "../Middleware/authMiddleware.js";

const router = express.Router();


router.post('/login',  Login);

router.put('/requestotp/:phone', requestotp);
router.get('/profile/:token', authMiddleware, onlyUser, userProfile);
router.delete('/:id', authMiddleware, onlyUser, deleteUser);
router.get('/userfind/:phone', user);

export default router;