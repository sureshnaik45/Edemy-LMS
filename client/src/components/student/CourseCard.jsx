import  { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

const CourseCard = ({course}) => {
  const {currency, calculateRating, userData} = useContext(AppContext)
  const navigate = useNavigate();
  const isEnrolled = userData?.enrolledCourses?.includes(course._id);

  const handleClick = () => {
    scrollTo(0,0);
    if (isEnrolled) {
      navigate('/player/' + course._id);
    } else {
      navigate('/course/' + course._id);
    }
  }
  return (
    <div onClick={handleClick} 
    className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg cursor-pointer transition-all hover:shadow-lg'>
      <img className='w-full' src={course.courseThumbnail} alt="courseThumbnail" />
      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold'>{course.courseTitle}</h3>
        
        <div className='flex items-center space-x-2'>
          <p>{calculateRating(course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_,i)=>(
              <img className='w-3.5 h-3.5' key={i} src={i<Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt='star' />
            ))}
          </div>
          <p className='text-gray-500'>{course.courseRatings.length}</p>
        </div>
        <p className='text-base font-semibold text-gray-800'>{currency} {(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}</p>
      </div>
    </div>
  )
}

export default CourseCard;