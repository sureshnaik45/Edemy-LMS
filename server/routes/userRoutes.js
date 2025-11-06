import express from "express";
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, enrollFreeCourse, updateUserCourseProgress, 
    userEnrolledCourses, getAllUserCourseProgress 
} from "../controllers/userController.js";
import { rateLimit } from 'express-rate-limit';

const userRouter = express.Router();

const purchaseLimiter = rateLimit({
	windowMs: 700 * 60 * 1000, // 1500 minutes means 1 day 1 hour
	max: 3, // Max 5 requests
	message: { success: false, message: 'Too many purchase attempts. Please try again in 15 minutes.' },
    standardHeaders: true, // Return rate limit info in the headers
	legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
});

userRouter.get('/data', getUserData);
userRouter.get('/enrolled-courses', userEnrolledCourses);
userRouter.post('/purchase', purchaseLimiter, purchaseCourse);
userRouter.post('/enroll-free', enrollFreeCourse);
userRouter.post('/update-course-progress', updateUserCourseProgress);
userRouter.post('/get-course-progress', getUserCourseProgress);
userRouter.get('/all-course-progress', getAllUserCourseProgress);
userRouter.post('/add-rating', addUserRating);

export default userRouter;