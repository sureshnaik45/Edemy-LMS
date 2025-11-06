import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";
import Loading from "./Loading";
import axios from "axios";
import { toast } from "react-toastify";

const CoursesSection = () => {
    const { backendUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);

    const fetchFeaturedCourses = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/course/featured`);
            if (data.success) {
                setCourses(data.courses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFeaturedCourses();
    }, []);

    return (
        <div className="py-16 md:px-40 px-8">
            <h2 className="text-3xl font-medium text-gray-800">Learn from the best</h2>
            <p className="text-sm md:text-base text-gray-500 mt-3">
                Discover our top-rated courses across various categories. From coding
                and design to <br /> business and wellness, our courses are crafted to deliver
                results.
            </p>

            {loading ? (
                <Loading />
            ) : (
                <div className="grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4">
                    {courses.map((course, index) => (
                        <CourseCard key={index} course={course} />
                    ))}
                </div>
            )}
            <Link
                to={"/course-list"}
                onClick={() => scrollTo(0, 0)}
                className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded"
            >
                Show all courses
            </Link>
        </div>
    );
};

export default CoursesSection;