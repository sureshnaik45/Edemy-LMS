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

## Tech Stack

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

## Installation & Setup

### 1️⃣ Clone the Repository

https://github.com/sureshnaik45/Edemy-LMS.git
cd Edemy-LMS

### 2️⃣ Install Dependencies

#### Frontend:
cd client
npm install
npm run dev

#### Backend:
cd server
npm install
npm start

### 3️⃣ Setup Environment Variables

You will need to create two `.env` files: one in the `client` folder and one in the `server` folder.

#### `client/.env`
Clerk Publishable Key (from Clerk Dashboard)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

The URL of your local or deployed backend
For local: http://localhost:3000
For Vercel: https://your-server-app-name.vercel.app
VITE_BACKEND_URL=http://localhost:3000

Default currency for display (e.g., "$", "₹")
VITE_CURRENCY=$

#### `server/.env`
CURRENCY = 'USD'
EDUCATOR_SECRET_KEY="ANY-SECRET-KEY"

MongoDB Connection String (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://...

Clerk Secret Key (from Clerk Dashboard)
CLERK_SECRET_KEY=sk_test_...

Clerk Webhook Secret (from Clerk Dashboard -> Webhooks)
CLERK_WEBHOOK_SECRET=whsec_...

Stripe Secret Key (from Stripe Dashboard -> API Keys)
STRIPE_SECRET_KEY=sk_test_...

Stripe Webhook Secret (from Stripe Dashboard -> Webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...

Cloudinary Credentials (from Cloudinary Dashboard)
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_SECRET_KEY=...

Default currency for payments (must match Stripe's currency)
CURRENCY=usd

Port for local development
PORT=3000

## API Endpoints

Here is a breakdown of all the available API routes in the backend (`server/`).

### Course Routes (Public)

These endpoints are public and used to display course information to all users.

  * **Base Path:** `/api/course`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/all` | Fetches all published courses. |
| `GET` | `/:id` | Fetches a single course by its ID for the details page. |

### User Routes (Student)

These endpoints require a user to be authenticated via Clerk.

  * **Base Path:** `/api/user`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/data` | Gets the logged-in user's data from the MongoDB database. |
| `GET` | `/enrolled-courses` | Fetches all courses the logged-in user is enrolled in. |
| `POST` | `/purchase` | Creates a new Stripe checkout session for a course purchase. |
| `POST` | `/update-course-progress` | Marks a specific lecture as completed for the user. |
| `POST` | `/get-course-progress` | Fetches the user's progress for a specific course. |
| `POST` | `/add-rating` | Allows a user to add or update a rating for an enrolled course. |

### Educator Routes

These endpoints require the user to be authenticated *and* have an "educator" role.

  * **Base Path:** `/api/educator`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/update-role` | Updates the user to become educator after verifying with the educator secret key |
| `POST` | `/add-course` | Adds a new course. Expects `multipart/form-data` with `courseData` (JSON string) and an `image` file. |
| `GET` | `/courses` | Fetches all courses created by the logged-in educator. |
| `GET` | `/dashboard` | Gathers statistics for the educator dashboard (earnings, student count, etc.). |
| `GET` | `/enrolled-students` | Gets a list of all students enrolled in the educator's courses. |

### Webhook Routes

These endpoints are not called by the frontend. They are called by external services (Clerk and Stripe) to send data to your server.

  * **Base Path:** `/`

| Method | Endpoint | Service | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/clerk` | Clerk | Listens for `user.created`, `user.updated`, and `user.deleted` events from Clerk to keep the MongoDB `User` collection in sync. |
| `POST` | `/stripe` | Stripe | Listens for `payment_intent.succeeded` and `payment_intent.payment_failed` events from Stripe to finalize purchases and grant course access.

## Future Work

### Educator Features

**Edit Course:** This is the most critical feature you are missing.
How: Create a new page like /educator/edit-course/:courseId. This page can reuse your existing AddCourse.jsx component. You would first fetch the course's data and use it to pre-fill all the state variables (title, price, chapters, etc.). Then, the form's "Submit" button would call a new PATCH /api/educator/course/:courseId endpoint to save the changes.

**Course Categories:** This is essential for helping students find courses.
How: Add a category: String field to your Course.js model. Add a dropdown menu (e.g., "Web Development", "Data Science", "Marketing") to your AddCourse.jsx form. Then, you can display these categories on your CourseCard.jsx and add filter buttons to the CoursesList.jsx page.

**Coupon/Discount Codes:** This is a powerful marketing tool for educators.
How: Create a new Mongoose model called Coupon. It would have a code (String), discountPercent (Number), and courseId (linking to the Course). You would then build a simple UI in the educator dashboard for them to create codes for their courses.

### Student Features
For giving a full professional experience (full-featured e-commerce platform)

**Shopping Cart:** Right now, users can only buy one course at a time.
How: You would need to manage a "cart" on the client (using React Context or localStorage). The "Enroll Now" button would become "Add to Cart." Then, you'd have a cart page that sends an array of courseIds to your purchaseCourse endpoint. This would require modifying your Stripe logic to handle multiple line_items.

**Wishlist:** A simple way to let users save courses for later.
How: Add a wishlist - [mongoose.Schema.Types.ObjectId] array to your User.js model. Add a "heart" icon to the CourseCard.jsx and CourseDetails.jsx pages, which would call POST /api/user/wishlist/add and POST /api/user/wishlist/remove endpoints.

**Written Reviews:** You already have 5-star ratings. The next step is to let users write a text review.
How: Add a reviewText: String field to the courseRatings object in your Course.js model. Add a <textarea> under the stars in your Player.jsx and CourseDetails.jsx pages to display them.

### Advanced Features (Community & Admin)
These are larger features that would provide a massive amount of value.

**Direct Video Upload:** Instead of relying on YouTube, hosting the videos ourself.
How: We already have Cloudinary and Multer for image uploads. We can re-use this.Configure Cloudinary to accept video files. In AddCourse.jsx, change the "Lecture URL" field to a file upload input. Create a new endpoint (e.g., POST /api/educator/upload-video) that uploads the video to Cloudinary and returns the secure URL. Use that new Cloudinary URL in your lectureUrl field. In Player.jsx, use a standard HTML5 <video> tag instead of react-youtube.

**Course Q&A Section**: This is one of the most valuable parts of an LMS.
How: Create a new Mongoose model called Discussion (or Question). It would need fields like courseId, userId, text, and an array of replies. You would then build this new component and add it as a tab in your Player.jsx page.

**Certificate of Completion:** Reward your users for finishing a course.
How: Your CourseProgress model tracks completed lectures. In your Player.jsx page, you can check if progressData.lectureCompleted.length equals totalLectures. If it does, show a "Get Certificate" button. This button would call an endpoint like GET /api/user/course/:courseId/certificate that generates a simple PDF (using a library like pdf-lib) with the user's name and course title.

**Full Admin Dashboard:** This is the "final form" of your educator secret key.
How: Create a new admin-only section of the site (e.g., /admin). You would manually add an role: "admin" to your own user in the Clerk dashboard. Then, create a new middleware in your backend that checks for this "admin" role. This dashboard would let you view all users, approve/deny new educator requests (instead of using a secret key), and see site-wide analytics.