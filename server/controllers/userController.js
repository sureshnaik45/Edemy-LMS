import Stripe from "stripe"
import Course from "../models/Course.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"
import { CourseProgress } from "../models/CourseProgress.js"

// Get users data
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.json({ success: false, message: "User not found!" }); 
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// User enrolled course with lecture lin
export const userEnrolledCourses = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')
        const enrolledCourses = userData.enrolledCourses.map(course => {
            return course.toJSON(userId);
        });
        res.json({success:true, enrolledCourses: userData.enrolledCourses})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// Purchase course
export const purchaseCourse = async (req,res) => {
    try {
        const {courseId} = req.body
        const {origin} = req.headers
        const userId = req.auth.userId;

        const userData = await User.findById(userId)

        const courseData = await Course.findById(courseId)
        if(!userData || !courseData)
        {
            return res.json({success: false, message: "Data Not Found"})
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData);

        // stripe gateway initialize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase();
        
        // creating line items to for stripe
        const line_items = [{
            price_data:{
                currency,
                product_data:{
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor( newPurchase.amount ) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })
        res.json({success: true, session_url: session.url})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// Enroll in a free course
export const enrollFreeCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.auth.userId;

        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData || !courseData) {
            return res.json({ success: false, message: "User or Course not found" });
        }

        // Check if already enrolled
        if (userData.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: "Already enrolled" });
        }

        // Check if course is actually free
        const price = (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2);
        if (price > 0.00) {
            return res.json({ success: false, message: "This course is not free" });
        }

        // Add user to course and course to user
        courseData.enrolledStudents.push(userData._id);
        userData.enrolledCourses.push(courseData._id);

        await courseData.save();
        await userData.save();

        res.json({ success: true, message: "Enrolled in free course successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update user Course progress
export const updateUserCourseProgress = async(req,res)=>{
    try {
        const userId = req.auth.userId
        const {courseId, lectureId} = req.body

        // validate input
        if (!courseId || !lectureId) {
            return res.json({ success: false, message: "Missing courseId or lectureId" });
        }
        const result = await CourseProgress.updateOne(
            { userId, courseId }, // The document to find
            {
                $addToSet: { lectureCompleted: lectureId }, // Atomically add lectureId to the set (array)
                $set: { completed: true } // You can set other fields at the same time
            },
            { upsert: true } // If no document matches, create it
        );

        // Check if a document was actually modified or created
        if (result.matchedCount === 0 && result.upsertedCount === 0) {
             return res.json({success: false, message: "Could not update progress."});
        }

        // Check if the lecture was already completed
        if (result.matchedCount > 0 && result.modifiedCount === 0 && result.upsertedCount === 0) {
             return res.json({success: true, message: "Lecture Already Completed"});
        }

        res.json({success:true, message: 'Progress Updated'})

    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

export const getAllUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        
        // Find all progress documents for the given user
        const progressData = await CourseProgress.find({ userId }).lean();
        
        res.json({ success: true, progressData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// get user course progress
export const getUserCourseProgress = async(req,res)=>{
    try {
        const userId = req.auth.userId
        const {courseId} = req.body
        const progressData = await CourseProgress.findOne({userId, courseId}).lean()
        res.json({success: true, progressData})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// Add user ratings to course
export const addUserRating = async (req,res)=>{
    try {
        const userId = req.auth.userId;
        const {courseId, rating} = req.body;

        if(!courseId || !userId || !rating || rating < 1 || rating > 5)
        {
            return res.json({success: false, message:"Invalid details"})
        }

        const course = await Course.findById(courseId)
        if(!course){
            return res.json({success: false, message:"Course Not found!"})
        }

        const user = await User.findById(userId)

        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success: false, message:"User has not purchased this course."})
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)
        if(existingRatingIndex > -1){
            course.courseRatings[existingRatingIndex].rating = rating;
        }
        else{
            course.courseRatings.push({userId,rating});
        }
        await course.save()
        res.json({success: true, message:"Rating Added"})

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}