import express from "express";
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, enrollFreeCourse, updateUserCourseProgress, 
    userEnrolledCourses, getAllUserCourseProgress } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/data', getUserData);
userRouter.get('/enrolled-courses', userEnrolledCourses);
userRouter.post('/purchase', purchaseCourse);
userRouter.post('/enroll-free', enrollFreeCourse);
userRouter.post('/update-course-progress', updateUserCourseProgress);
userRouter.post('/get-course-progress', getUserCourseProgress);
userRouter.get('/all-course-progress', getAllUserCourseProgress);
userRouter.post('/add-rating', addUserRating);

export default userRouter;