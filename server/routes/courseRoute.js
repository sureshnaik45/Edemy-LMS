import express from "express";
import { getAllCourse, getCourseId, getFeaturedCourses } from "../controllers/courseController.js";

const courseRouter = express.Router()

courseRouter.get('/all', getAllCourse);
courseRouter.get('/featured', getFeaturedCourses);
courseRouter.get('/:id', getCourseId);

export default courseRouter;