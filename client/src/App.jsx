import React, { Suspense } from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Navbar from './components/student/Navbar'
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify';
import Loading from './components/student/Loading';

const Home = React.lazy(() => import('./pages/student/Home'));
const CoursesList = React.lazy(() => import('./pages/student/CoursesList'));
const CourseDetails = React.lazy(() => import('./pages/student/CourseDetails'));
const MyEnrollments = React.lazy(() => import('./pages/student/MyEnrollments'));
const Player = React.lazy(() => import('./pages/student/Player'));
const About = React.lazy(() => import('./components/About'));
const ContactForm = React.lazy(() => import('./components/ContactForm'));
const Educator = React.lazy(() => import('./pages/educator/Educator'));
const Dashboard = React.lazy(() => import('./pages/educator/Dashboard'));
const AddCourse = React.lazy(() => import('./pages/educator/AddCourse'));
const MyCourses = React.lazy(() => import('./pages/educator/MyCourses'));
const StudentsEnrolled = React.lazy(() => import('./pages/educator/StudentsEnrolled'));
const AppLoading = React.lazy(() => import('./components/student/Loading'));

const App = () => {
  const isEducatorRoute = useMatch('/educator/*')
  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer />
      {!isEducatorRoute &&<Navbar/> }
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/course-list' element={<CoursesList/>} />
          <Route path='/course-list/:input' element={<CoursesList/>} />
          <Route path='/course/:id' element={<CourseDetails/>} />
          <Route path='/my-enrollments' element={<MyEnrollments/>} />
          <Route path='/player/:courseId' element={<Player/>} />
          <Route path='/loading/:path' element={<AppLoading/>} />

          <Route path='/about' element={<About/>} />
          <Route path='/contact' element={<ContactForm/>} />

          <Route path='/educator' element={ <Educator />} >
              <Route path='/educator' element={<Dashboard />} />
              <Route path='add-course' element={<AddCourse />} />
              <Route path='my-courses' element={<MyCourses />} />
              <Route path='student-enrolled' element={<StudentsEnrolled />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
