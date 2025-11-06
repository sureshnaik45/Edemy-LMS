import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const CoursesList = () => {
	const { navigate, backendUrl } = useContext(AppContext);
	const { input } = useParams();
	const [filteredCourse, setFilteredcourse] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchCourses = async () => {
        setLoading(true);
        try {
            // If there's an input, send it as a search query
            const url = input 
                ? `${backendUrl}/api/course/all?search=${input}` 
                : `${backendUrl}/api/course/all`;
            
            const { data } = await axios.get(url);
            
            if(data.success) {
                setFilteredcourse(data.courses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    };

	useEffect(() => {
		fetchCourses();
	}, [input]);

	return (
		<>
			<div className="relative md:px-36 px-8 pt-20 text-left">
				<div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
					<div>
						<h1 className="text-4xl font-semibold text-gray-800">
							Course List
						</h1>
						<p className="text-gray-500">
							<span
								onClick={() => navigate("/")}
								className="text-blue-600 cursor-pointer"
							>
								Home{" "}
							</span>{" "}
							/ <span>Course List</span>
						</p>
					</div>
					<SearchBar data={input} />
				</div>

				{
				input && <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600">
					<p>{input}</p>
					<img src={assets.cross_icon} alt="cross_icon"  className="cursor-pointer" onClick={()=> navigate('/course-list')}/>
				</div>
				}
				{loading ? (
                    <Loading />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
                        {filteredCourse.map((course, index) => (
                            <CourseCard key={index} course={course} />
                        ))}
                    </div>
                )}
                {!loading && filteredCourse.length === 0 && (
                     <p className="text-center text-gray-500 my-16">No courses found.</p>
                )}
			</div>
			<Footer/>
		</>
	);
};

export default CoursesList;
