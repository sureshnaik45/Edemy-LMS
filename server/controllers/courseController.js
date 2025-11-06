import Course from "../models/Course.js";

export const getAllCourse = async (req,res) => {
    try {
        const { search } = req.query;
        const filter = { isPublished: true };

        // If there is a search query, add it to the filter
        // This uses a regex to find any course where the title contains the search text, case-insensitive
        if (search) {
            filter.courseTitle = { $regex: search, $options: 'i' };
        }
        
        // Use the filter in the .find() method
        const courses = await Course.find(filter)
            .select(['-courseContent','-enrolledStudents'])
            .populate({path: 'educator'});
        res.json ({success: true, courses})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

export const getFeaturedCourses = async (req, res) => {
    try {
        const courses = await Course.find({isPublished: true})
            .select(['-courseContent', '-enrolledStudents']) // Exclude large fields
            .populate({path: 'educator'})
            .sort({ createdAt: -1 }) // Get the newest courses
            .limit(4); // Only get 4

        res.json ({success: true, courses})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

export const getCourseId = async(req,res)=>{
    const {id} = req.params;
    const userId = req.auth?.userId;
    try {
        const courseData = await Course.findById(id).populate({path:'educator'});
        if (!courseData) {
             return res.json({success: false, message: "Course not found"});
        }

        const isEducator = courseData.educator._id.toString() === userId;

        if (!courseData.isPublished && !isEducator) {
            return res.json({ success: false, message: "Course not found" });
        }

        const processedCourseData = courseData.toJSON(userId);
        
        res.json({ success: true, courseData: processedCourseData });
        
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}