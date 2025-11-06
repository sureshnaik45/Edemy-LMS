import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'

export const updateRoleToEducator = async (req,res)=>{
    try {
        const userId = req.auth.userId;

        const { secret } = req.body;

        if (!secret || secret !== process.env.EDUCATOR_SECRET_KEY) {
            return res.json({ success: false, message: "Unauthorized: Invalid secret key." });
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: 'educator',
            }
        })
        res.json({success: true, message: 'You can publish a course now'})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

export const addCourse = async (req, res) => {
    let imageUpload;
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.json({ success: false, message: "Thumbnail Not Attached" });
        }

        const parsedCourseData = JSON.parse(courseData);

        const { courseTitle, courseDescription, coursePrice, courseContent, discount } = parsedCourseData;

        if (!courseTitle || !courseDescription || coursePrice == null || discount == null) {
            return res.json({ success: false, message: "Missing required fields: Title, Description, Price, or Discount." });
        }
        if (coursePrice < 0 || discount < 0 || discount > 100) {
             return res.json({ success: false, message: "Invalid price or discount." });
        }
        if (!courseContent || !Array.isArray(courseContent) || courseContent.length === 0) {
            return res.json({ success: false, message: "Course must have at least one chapter." });
        }

        parsedCourseData.educator = educatorId;

        // Ensure 'isPublished' defaults to true
        // parsedCourseData.isPublished = parsedCourseData.isPublished ?? true;

        // Ensure all lectures have required fields
        // if (!parsedCourseData.courseContent?.every(chapter => 
        //     chapter.chapterContent?.every(lecture => lecture.lectureId && lecture.lectureurl)
        // )) {
        //     return res.json({ success: false, message: "Lecture ID and URL are required in all chapters." });
        // }

        // Upload image first
        imageUpload = await cloudinary.uploader.upload(imageFile.path);
        parsedCourseData.courseThumbnail = imageUpload.secure_url;

        // Create course after ensuring image is uploaded
        const newCourse = await Course.create(parsedCourseData);
        await newCourse.save()

        res.json({ success: true, message: "Course Added", course: newCourse });

    } catch (error) {
        // If an error happened (e.g., database save failed) AND
        // an image was already uploaded, we must delete it.
        if (imageUpload) {
            // Get the public_id from the secure_url
            const publicId = imageUpload.public_id;
            await cloudinary.uploader.destroy(publicId);
        }
        res.json({ success: false, message: error.message });
    }
};

// Get educator courses
export const getEducatorCourses = async(req,res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        // Get all purchase data for this educator's courses
        const courseIds = courses.map(course => course._id);
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        });

        // Create a simple map to store earnings per course
        const earningsMap = new Map();
        purchases.forEach(purchase => {
            const courseId = purchase.courseId.toString();
            const currentEarnings = earningsMap.get(courseId) || 0;
            earningsMap.set(courseId, currentEarnings + purchase.amount);
        });

        // Combine the course data with the calculated earnings
        const coursesWithEarnings = courses.map(course => {
            const courseObject = course.toObject(); // Convert from Mongoose doc
            // Get the earnings from our map, or default to 0
            courseObject.earnings = (earningsMap.get(course._id.toString()) || 0).toFixed(2);
            return courseObject;
        });
        res.json({success: true, courses: coursesWithEarnings})
        
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// get educator dashboard data (total earnings, enrolled students, No. of courses)
export const educatorDashboardData = async(req,res) =>{
    try {
        const educator = req.auth.userId

        const courses = await Course.find({educator});
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id)

        // Get all completed purchases in ONE query
        const allPurchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        });

        const totalEnrollments = allPurchases.length;
        const totalEarnings = Math.round(allPurchases.reduce((sum, purchase) => sum + purchase.amount, 0)).toFixed(2);

        // Get latest 5 enrollments for the table in a SECOND efficient query
        const latestPurchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        })
        .populate('userId', 'name imageUrl') // Get student info
        .populate('courseId', 'courseTitle') // Get course title
        .sort({ createdAt: -1 }) // Get newest first
        .limit(5); // Only get 5

        // Format the "Latest Enrollments" data for the table
        const enrolledStudentsData = latestPurchases.map(purchase => ({
            courseTitle: purchase.courseId.courseTitle,
            student: purchase.userId
        }));
        res.json({success: true, dashboardData: {
            totalEarnings, enrolledStudentsData, totalCourses, totalEnrollments
        }})
    } catch (error) {
        res.json({success: false, message:error.message})    
    }
}

export const publishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const educatorId = req.auth.userId;

        // This query is secure: it will only update the course if the ID matches
        // AND the educator ID matches the logged-in user.
        const updatedCourse = await Course.findOneAndUpdate(
            { _id: courseId, educator: educatorId }, // Find by courseId AND educatorId
            { isPublished: true }, // Set to published
            { new: true } // Return the updated document
        );

        if (!updatedCourse) {
            return res.json({ success: false, message: "Course not found or you are not the owner." });
        }

        res.json({ success: true, message: "Course published successfully!", course: updatedCourse });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Enrolled Students Data with purchase data
export const getEnrolledStudentsData = async(req,res) =>{
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator})
        const courseIds = courses.map(course => course._id)

        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({success: true, enrolledStudents});

    } catch (error) {
        res.json({success: false, message:error.message})
    }
}