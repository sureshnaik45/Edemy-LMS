# Edemy LMS

Edemy LMS is a full-stack Learning Management System (LMS) built with the MERN stack (MongoDB, Express, React, Node.js). It provides a complete platform for educators to create, manage, and sell courses, and for students to browse, purchase, and learn.

The platform uses modern tools like Clerk for user authentication, Stripe for payments, and Cloudinary for media hosting.

## How It Works

Think of Edemy LMS as a digital school or marketplace:

* **For Students:** You can visit the website, browse a list of courses, search for topics you're interested in, and watch free preview lessons. If you like a course, you can purchase it securely (using Stripe). Once enrolled, you get a "My Enrollments" page to track your progress and watch all the video lessons in a dedicated player. You can even rate courses you've completed.

* **For Educators:** You can sign up and "Become an Educator." This gives you a special dashboard where you can:
    * **Add Courses:** Create new courses with titles, descriptions, prices, and upload thumbnails.
    * **Build Curriculum:** Add chapters and individual video lectures (with URLs and durations) to your courses.
    * **View Your Courses:** See a list of all the courses you've created.
    * **Track Students:** See a list of students who have enrolled in your courses.
    * **See Stats:** The dashboard shows your total earnings, total courses, and total student enrollments.

## Core Features

* **Full User Authentication:** Secure sign-up, sign-in, and profile management handled by **Clerk**.
* **Two User Roles:**
    * **Student:** Can browse, purchase, watch, and rate courses.
    * **Educator:** Can create courses, upload content, and track earnings/students.
* **Course Management:** Educators can create, read, and manage courses and their content (chapters, lectures).
* **Stripe Payment Integration:** Secure checkout and payment processing for course enrollments.
* **Video Player:** A dedicated page for students to watch course lectures (using `react-youtube`).
* **Course Progress Tracking:** Students can mark lectures as complete and see their progress.
* **Cloud Media Uploads:** Course thumbnails are uploaded to **Cloudinary** (via `multer`).
* **Educator Dashboard:** Shows key metrics like total earnings, total courses, and latest enrollments.
* **Webhooks:** Uses **Svix** and **Stripe** webhooks to automatically sync user data from Clerk to the MongoDB database and confirm purchases.
* **Responsive Design:** A clean, modern UI built with **Tailwind CSS** that works on desktop and mobile.

## 🛠️ Tech Stack

### Frontend (`client/`)
* **Framework:** React (built with Vite)
* **Routing:** React Router DOM
* **Authentication:** @clerk/clerk-react
* **Payments:** Stripe
* **Styling:** Tailwind CSS
* **Video Player:** React YouTube
* **Rich Text Editor:** Quill
* **API Calls:** Axios
* **Animations:** Framer Motion
* **Notifications:** React Toastify

### Backend (`server/`)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** @clerk/express
* **Payments:** Stripe
* **File Uploads:** Cloudinary & Multer
* **Webhooks:** Svix (for Clerk)
* **Middleware:** CORS, dotenv