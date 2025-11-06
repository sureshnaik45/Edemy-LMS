import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureId: {type: String, required: true},
    lectureTitle: {type: String, required: true},
    lectureDuration: {type: Number, required: true},
    lectureUrl: {type: String, required: true},
    isPreviewFree: {type: Boolean, default: true},
    lectureOrder: {type: Number, required: true},

},{_id: false});

const chapterSchema = new mongoose.Schema({
    chapterId: {type: String, required: true},
    chapterOrder: {type: Number, required: true},
    chapterTitle: {type: String, required: true},
    chapterContent: [lectureSchema]
},{_id: false});

const courseSchema = new mongoose.Schema({
    courseTitle: {type: String, required: true},
    courseDescription: {type: String, required: true},
    courseThumbnail: {type: String},
    coursePrice: {type: Number, required: true},
    isPublished: { type: Boolean, default: false },

    discount: {type: Number, required: true, min:0, max: 100},
    courseContent: [chapterSchema],
    courseRatings:[
        {userId: {type:String}, rating: {type: Number, min: 1, max: 5}}
    ],
    educator:{ type: String, ref: 'User', required: true},
    enrolledStudents: [
        {type: String, ref: 'User'}
    ]
},{timestamps: true, minimize: false})

courseSchema.methods.toJSON = function (userId) {
    const courseObject = this.toObject();

    // Convert userId safely to string (handles undefined or null)
    const userIdStr = userId ? userId.toString() : null;

    // Check if user is enrolled or the educator
    const isEnrolled = userIdStr
        ? courseObject.enrolledStudents?.some(
              (id) => id.toString() === userIdStr
          )
        : false;

    const isEducator = userIdStr
        ? courseObject.educator?.toString() === userIdStr
        : false;

    // If user is enrolled or educator, return full data
    if (isEnrolled || isEducator) {
        return courseObject;
    }

    // Otherwise, hide URLs for non-preview lectures
    if (courseObject.courseContent && Array.isArray(courseObject.courseContent)) {
        courseObject.courseContent.forEach((chapter) => {
            if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
                chapter.chapterContent.forEach((lecture) => {
                    if (!lecture.isPreviewFree) {
                        lecture.lectureUrl = ""; // Hide the URL
                    }
                });
            }
        });
    }

    return courseObject;
};

const Course = mongoose.model('Course', courseSchema)
export default Course;